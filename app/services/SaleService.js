const NotAuthorized = require("../errors/NotAuthorized")
const ItemNotFound = require("../errors/ItemNotFound")
const MachineNotFound = require("../errors/MachineNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const UserNotFound = require("../errors/UserNotFound")
const InvalidPeriod = require("../errors/InvalidPeriod")
const ItemMatrixNotFound = require("../errors/ItemMatrixNotFound")
const Sale = require("../models/Sale")
const FiscalReceiptDTO = require("../models/FiscalReceiptDTO")
const ButtonItem = require("../models/ButtonItem")
const Permission = require("../enum/Permission")
const SalesSummary = require("../models/SalesSummary")
const microservices = require("../utils/microservices")
const logger = require("my-custom-logger")
const {getFiscalString} = require("./FiscalService")

class SaleService {

    constructor({SaleModel, ButtonItemModel, ItemModel, controllerService, itemService, machineService, kktService}) {
        this.Sale = SaleModel
        this.Item = ItemModel
        this.ButtonItem = ButtonItemModel
        this.controllerService = controllerService
        this.itemService = itemService
        this.machineService = machineService
        this.kktService = kktService

        this.createSale = this.createSale.bind(this)
        this.registerSale = this.registerSale.bind(this)
        this.getLastSale = this.getLastSale.bind(this)
        this.getLastSaleOfItem = this.getLastSaleOfItem.bind(this)


    }


    async createSale(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_SALE)) {
            throw new NotAuthorized()
        }

        const {buttonId, type, price, itemId, itemMatrixId, machineId, time} = input

        const sale = new Sale()
        sale.buttonId = buttonId
        sale.type = type
        sale.price = price
        sale.item_id = itemId
        sale.item_matrix_id = itemMatrixId
        sale.machine_id = machineId

        if (time) {
            sale.createdAt = time
            sale.updatedAt = time
        }

        return await this.Sale.create(sale)
    }

    async registerSale(input, user) {
        if (!user || !user.checkPermission(Permission.REGISTER_SALE)) {
            throw new NotAuthorized()
        }

        //todo transaction

        let {controllerUid, type, price, buttonId} = input

        const controller = await this.controllerService.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new ControllerNotFound
        }

        const machine = await this.machineService.getMachineByControllerId(controller.id, user)

        if (!machine) {
            throw new MachineNotFound()
        }

        const itemMatrix = await machine.getItemMatrix()

        if (!itemMatrix) {
            throw new ItemMatrixNotFound()
        }


        const createdSale = await this.Sale.sequelize.transaction(async (transaction) => {
            const buttons = await itemMatrix.getButtons()

            if (!buttons.some((buttonItem) => Number(buttonItem.buttonId) === buttonId)) {
                const name = `Товар ${buttonId}`
                const itemUser = itemMatrix.getUser()
                itemUser.checkPermission = () => true

                const item = await this.itemService.createItem({name}, itemUser, transaction)

                const button = new ButtonItem()
                button.buttonId = buttonId
                button.item_id = item.id
                button.item_matrix_id = itemMatrix.id

                const buttonItem = await this.ButtonItem.create(button, {transaction})

                buttons.push(buttonItem)
            }

            const [itemId] = buttons
                .filter((buttonItem) => Number(buttonItem.buttonId) === buttonId)
                .map(buttonItem => buttonItem.item_id)

            if (!itemId) {
                logger.error("Unexpected situation, ItemId for sale not found")
                throw new ItemNotFound()
            }

            const sale = new Sale()
            sale.type = type
            sale.price = price
            sale.item_id = itemId
            sale.machine_id = machine.id

            controller.connected = true
            await controller.save({transaction})

            return await this.Sale.create(sale, {transaction})
        })


        const item = await createdSale.getItem()
        createdSale.item = item


        const getTwoDigitDateFormat = (monthOrDate) => {
            return (monthOrDate < 10) ? "0" + monthOrDate : "" + monthOrDate
        }

        //Фэйковые данные
        const receiptDateUtcDate = new Date()
        let mappedReceiptDate = ""
        mappedReceiptDate += receiptDateUtcDate.getFullYear() + ""
        mappedReceiptDate += getTwoDigitDateFormat((receiptDateUtcDate.getMonth() + 1)) + ""
        mappedReceiptDate += getTwoDigitDateFormat(receiptDateUtcDate.getDate()) + ""
        mappedReceiptDate += "T"
        mappedReceiptDate += getTwoDigitDateFormat(receiptDateUtcDate.getHours())
        mappedReceiptDate += getTwoDigitDateFormat(receiptDateUtcDate.getMinutes())
        //Фэйковые данные
        const sqr = `t=${mappedReceiptDate}&s=0.00&fn=0000000000001&i=00001&fp=0000000001&n=1`
        //В нефискальном режиме вернем фэйковую строку
        createdSale.sqr = sqr
        if (price === 0) {
            //Если цена 0 - не делаем фискальный чек
            return createdSale
        }


        if (controller.fiscalizationMode === "APPROVED" || controller.fiscalizationMode === "UNAPPROVED") {

            const controllerUser = await controller.getUser()

            if (!controllerUser) {
                throw new UserNotFound()
            }

            controllerUser.checkPermission = () => true

            const legalInfo = await controllerUser.getLegalInfo()

            if (!legalInfo) {
                throw new Error("LegalInfo is not set")
            }


            const userKkts = await this.kktService.getUserKkts(controllerUser)
            const activatedKkts = userKkts.filter(kkt => kkt.kktActivationDate)
            const [kkt] = activatedKkts.filter(kkt.id === machine.kktId)

            if (activatedKkts.length) {
                const {inn, sno, companyName} = legalInfo

                const place = machine.place || "Торговый автомат"

                const productName = item.name || "Товар " + buttonId

                const email = legalInfo.contactEmail
                const productPrice = price.toFixed(2)

                let kktRegNumber,kktFNNumber = null

                if (kkt) {
                    kktRegNumber = kkt.kktRegNumber
                    kktFNNumber = kkt.kktFNNumber
                }

                try {

                    const fiscalReceiptDTO = new FiscalReceiptDTO({
                        email,
                        sno,
                        inn,
                        place,
                        itemName: productName,
                        itemPrice: productPrice,
                        paymentType: type,
                        kktRegNumber
                    })


                    //const uuid = await sendCheck(fiscalData, token, server, machineKkt)
                    const receiptId = (await microservices.fiscal.createReceipt(fiscalReceiptDTO)).id

                    let receipt
                    let timeoutDate = (new Date()).getTime() + (1000 * Number(process.env.FISCAL_STATUS_POLL_TIMEOUT_SECONDS))

                    while (receipt && receipt.status === "PENDING") {
                        receipt = await await microservices.fiscal.getReceiptById(receiptId)

                        if (new Date() > timeoutDate) {
                            break
                        }
                    }


                    const {
                        fnsSite,
                        receiptDatetime,
                        shiftNumber,
                        fiscalReceiptNumber,
                        fiscalDocumentNumber,
                        ecrRegistrationNumber,
                        fiscalDocumentAttribute,
                        fnNumber
                    } = receipt.fiscalData


                    const kkt = await this.kktService.kktPlusBill(fnNumber, controllerUser)

                    kkt.kktLastBill = receiptDatetime

                    await kkt.save()

                    createdSale.sqr = getFiscalString(receipt)

                    const replacements = {
                        companyName,
                        inn,
                        fiscalReceiptNumber,
                        receiptNumberInShift: shiftNumber,
                        receiptDate: receiptDatetime,
                        address: place,
                        productName,
                        productPrice,
                        incomeAmountCash: type === "CASH" ? productPrice : 0,
                        incomeAmountCashless: type === "CASHLESS" ? productPrice : 0,
                        email,
                        fnsSite,
                        sno,
                        regKKT: ecrRegistrationNumber,
                        hwIdKKT: kktFNNumber,
                        FD: fiscalDocumentNumber,
                        FPD: fiscalDocumentAttribute,
                        sqr: createdSale.sqr
                    }

                    if (controller.remotePrinterId) {
                        try {
                            await microservices.remotePrinting.sendPrintJob(controller.remotePrinterId, replacements)
                            logger.debug("PrintJob sent")
                        } catch (e) {
                            logger.error("Failed to send remote print job")
                        }
                    }
                } catch (err) {
                    logger.info(err)
                }
            }
        }
        return createdSale
    }


    async getLastSale(machineId, user) {
        if (!user || !user.checkPermission(Permission.GET_LAST_SALE)) {
            throw new NotAuthorized()
        }

        return await this.Sale.findOne({
            where: {machine_id: machineId},
            order: [
                ["id", "DESC"],
            ]
        })
    }

    async getLastSaleOfItem(itemId, user) {
        if (!user || !user.checkPermission(Permission.GET_LAST_SALE_OF_ITEM)) {
            throw new NotAuthorized()
        }

        return await this.Sale.findOne({
            where: {item_id: itemId},
            order: [
                ["id", "DESC"],
            ]
        })
    }

    async getSalesSummary(input, user) {
        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        const {machineId, period, itemId} = input

        const {sequelize} = this.Sale
        const {Op} = sequelize

        const where = {}

        if (machineId) {
            where.machine_id = machineId
        } else {
            const machines = await this.machineService.getAllMachinesOfUser(user)

            where.machine_id = {
                [Op.in]: machines.map(machine => machine.id)
            }
        }

        if (itemId) {
            where.item_id = itemId
        }

        if (period) {
            const {from, to} = period

            if (from > to) {
                throw new InvalidPeriod()
            }

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        const salesSummaryByType = await this.Sale.findAll({
            where,
            attributes: [
                "item_id",
                "type",
                [sequelize.fn("COUNT", "sales.id"), "overallCount"],
                [sequelize.fn("sum", sequelize.col("sales.price")), "overallAmount"]
            ],
            group: ["type", "sales.item_id", "item.id"],
            include: [{model: this.Item}],
        })

        const salesSummary = new SalesSummary()

        const cashSalesSummaries = salesSummaryByType.filter(salesSummary => salesSummary.type === "CASH")
        const cashlessSalesSummaries = salesSummaryByType.filter(salesSummary => salesSummary.type === "CASHLESS")

        if (cashSalesSummaries) {
            const cashAmount = cashSalesSummaries.reduce((acc, cashSalesSummary) => {
                if (!Number(cashSalesSummary.dataValues.overallAmount)) {
                    return acc
                }

                return acc + Number(cashSalesSummary.dataValues.overallAmount)
            }, 0)

            salesSummary.cashAmount = cashAmount
        }

        if (cashlessSalesSummaries) {
            const cashlessAmount = cashlessSalesSummaries.reduce((acc, cashlessSalesSummary) => {
                if (!Number(cashlessSalesSummary.dataValues.overallAmount)) {
                    return acc
                }

                return acc + Number(cashlessSalesSummary.dataValues.overallAmount)
            }, 0)

            salesSummary.cashlessAmount = cashlessAmount
        }


        const salesCount = salesSummaryByType.reduce((acc, salesSummary) => {
            if (!Number(salesSummary.dataValues.overallCount)) {
                return acc
            }

            const overallCount = Number(salesSummary.dataValues.overallCount)

            return acc + overallCount
        }, 0)

        salesSummary.salesCount = salesCount

        const overallAmount = salesSummaryByType.reduce((acc, salesSummary) => {
            if (!Number(salesSummary.dataValues.overallAmount)) {
                return acc
            }

            const overallAmount = Number(salesSummary.dataValues.overallAmount)

            return acc + overallAmount
        }, 0)

        salesSummary.overallAmount = overallAmount

        return salesSummary


    }

}

module.exports = SaleService
