const NotAuthorized = require("../errors/NotAuthorized")
const ItemNotFound = require("../errors/ItemNotFound")
const MachineNotFound = require("../errors/MachineNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const UserNotFound = require("../errors/UserNotFound")
const InvalidPeriod = require("../errors/InvalidPeriod")
const ItemMatrixNotFound = require("../errors/ItemMatrixNotFound")
const Sale = require("../models/Sale")
const FiscalReceiptDTO = require("../models/FiscalReceiptDTO")
const Receipt = require("../models/Receipt")
const ButtonItem = require("../models/ButtonItem")
const Permission = require("../enum/Permission")
const SalesSummary = require("../models/SalesSummary")
const microservices = require("../utils/microservices")
const logger = require("my-custom-logger")

const MachineLogType = require("../enum/MachineLogType")
const {getFiscalString} = require("./FiscalService")

class SaleService {

    constructor({MachineGroupModel, MachineModel, SaleModel, ButtonItemModel, ItemModel, TempMachineModel, TempModel, controllerService, itemService, machineService, kktService, redis}) {
        this.Sale = SaleModel
        this.redis = redis
        this.MachineGroup = MachineGroupModel
        this.Machine = MachineModel
        this.Item = ItemModel
        this.ButtonItem = ButtonItemModel
        this.TempMachine = TempMachineModel
        this.Temp = TempModel
        this.controllerService = controllerService
        this.itemService = itemService
        this.machineService = machineService
        this.kktService = kktService

        this.createSale = this.createSale.bind(this)
        this.registerSale = this.registerSale.bind(this)
        this.getLastSale = this.getLastSale.bind(this)
        this.getSaleById = this.getSaleById.bind(this)
        this.getReceiptOfSale = this.getReceiptOfSale.bind(this)
        this.getMachineOfSale = this.getMachineOfSale.bind(this)
        this.getItemOfSale = this.getItemOfSale.bind(this)
        this.getSales = this.getSales.bind(this)
        this.getLastSaleOfItem = this.getLastSaleOfItem.bind(this)
        this.getItemSales = this.getItemSales.bind(this)


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

        let itemType = "commodity"
        const controller = await this.controllerService.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new ControllerNotFound()
        }



        const machine = await this.machineService.getMachineByControllerId(controller.id, user)

        if (!machine) {
            throw new MachineNotFound()
        }


        if(type === "CASHLESS"){
            await this.redis.set("terminal_status_" + machine.id, `OK`, "EX", 24 * 60 * 60)
            controller.cashless = "ON"
        }

        if(type === "CASH"){
            if(price % 50){
                await this.redis.set("machine_coin_collector_status_" + machine.id, `OK`, "EX", 24 * 60 * 60)
            }
            else{
                await this.redis.set("machine_banknote_collector_status_" + machine.id, `OK`, "EX", 24 * 60 * 60)
            }

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
                button.type = itemType
                button.multiplier = 1
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
            const [button] = buttons.filter((buttonItem) => Number(buttonItem.buttonId) === buttonId)

            if(!button.multiplier){
                button.multiplier = 1
            }
            if(!button.type){
                button.type = "commodity"
            }
            itemType = button.type
            const sale = new Sale()
            sale.type = type
            sale.price = price * button.multiplier
            if(sale.price > 4999){
                throw new ItemNotFound()
            }
            sale.item_id = itemId
            sale.machine_id = machine.id

            controller.connected = true
            controller.status = "ENABLED"
            await controller.save({transaction})

            return await this.Sale.create(sale, {transaction})
        })

        await this.redis.set("machine_last_sale_" + machine.id, createdSale.createdAt)
        const item = await createdSale.getItem()
        createdSale.item = item

        logger.debug(`sale_created ${createdSale.id} ${item.name} ${createdSale.price} ${createdSale.createdAt}`)

        //set machine error to OK
        await this.redis.set("machine_error_" + machine.id, `OK`, "EX", 24 * 60 * 60)

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

            if (controllerUser.role === "VENDOR_NEGATIVE_BALANCE") {
                throw new Error("USER LOCKED BY BALANCE")
            }


            const userKkts = await this.kktService.getUserKkts(controllerUser)
            const activatedKkts = userKkts.filter(kkt => kkt.kktActivationDate)

            const [kkt] = activatedKkts.filter(kkt => kkt.id === machine.kktId || machine.kktId === 0)

            if (activatedKkts.length) {
                const {inn, sno, companyName} = legalInfo

                const place = machine.place || "Торговый автомат"

                const productName = item.name || "Товар " + buttonId

                const email = legalInfo.contactEmail
                const productPrice = Number(createdSale.price).toFixed(2)
                let kktRegNumber, kktFNNumber = null

                if (kkt) {
                    kktRegNumber = kkt.kktRegNumber
                    kktFNNumber = kkt.kktFNNumber
                }

                try {

                    const fiscalReceiptDTO = new FiscalReceiptDTO({
                        controllerUid,
                        email,
                        sno,
                        inn,
                        place,
                        itemName: productName,
                        itemPrice: productPrice,
                        paymentType: type,
                        kktRegNumber,
                        itemType
                    })



                    //const uuid = await sendCheck(fiscalData, token, server, machineKkt)
                    const receiptId = (await microservices.fiscal.createReceipt(fiscalReceiptDTO)).id

                    if (!receiptId) {
                        throw new Error("ReceiptId is null")
                    }

                    createdSale.receiptId = receiptId
                    await createdSale.save()

                    let receipt = {status: "PENDING"}
                    let timeoutDate = (new Date()).getTime() + (1000 * Number(process.env.FISCAL_STATUS_POLL_TIMEOUT_SECONDS))

                    while (receipt.status === "PENDING") {
                        receipt = await microservices.fiscal.getReceiptById(receiptId)

                        if (new Date() > timeoutDate) {

                            throw new Error("Receipt status timeout")
                        }

                        if (receipt.status === "ERROR") {
                            await this.redis.set("kkt_status_" + machine.id, `ERROR`, "EX", 24 * 60 * 60)
                            await this.machineService.addLog(machine.id, `Ошибка отправки чека`, MachineLogType.KKT, controllerUser)
                            throw new Error("Receipt failed to process")
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
                    await this.redis.set("kkt_status_" + machine.id, `OK`, "EX", 24 * 60 * 60)


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
                    logger.info(`sale_service_err ${err} ${JSON.stringify(err)}`)
                }
            }
        }
        return createdSale
    }


    async getLastSale(machineId, user) {
        if (!user || !user.checkPermission(Permission.GET_LAST_SALE)) {
            throw new NotAuthorized()
        }

        const lastSale = await this.redis.get("machine_last_sale_" + machineId)

        return {createdAt: new Date(lastSale)}



    }

    async getSales({offset, limit, machineId, itemId, user}) {
        if (!user || !user.checkPermission(Permission.GET_SALES)) {
            throw new NotAuthorized()
        }

        if (!limit) {
            limit = Number(process.env.PAGINATION_DEFAULT_LIMIT)
        }

        if (limit > Number(process.env.PAGINATION_MAX_LIMIT)) {
            throw new Error("Cannot request more than " + process.env.PAGINATION_MAX_LIMIT)
        }

        const where = {}

        if (machineId) {
            where.machine_id = machineId
        }

        if (itemId) {
            where.item_id = itemId
        }

        return await this.Sale.findAll({
            offset,
            limit,
            where,
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

    async getSaleById(saleId, user) {
        if (!user || !user.checkPermission(Permission.GET_SALES)) {
            throw new NotAuthorized()
        }

        return await this.Sale.findOne({
            where: {id: saleId}
        })
    }

    async getReceiptOfSale(saleId, user) {
        if (!user || !user.checkPermission(Permission.GET_RECEIPT)) {
            throw new NotAuthorized()
        }

        const sale = await this.getSaleById(saleId, user)

        if (!sale || !sale.receiptId) {
            return null
        }

        const receipt = await microservices.fiscal.getReceiptById(sale.receiptId)

        return new Receipt(sale.createdAt, receipt.status, receipt.paymentType)
    }


    async getFastSummary(user) {
        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        return this.Temp.findOne({
            where: {
                user_id: user.id
            }
        })

    }

    async getItemOfSale(saleId, user) {
        if (!user || !user.checkPermission(Permission.GET_ITEM_BY_ID)) {
            throw new NotAuthorized()
        }

        const sale = await this.getSaleById(saleId, user)

        if (!sale) {
            throw new Error("Sale not found")
        }

        const item = await this.itemService.getItemById(sale.item_id, user)

        if (!item) {
            throw new Error("Item not found")
        }

        return item
    }

    async getMachineOfSale(saleId, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_BY_ID)) {
            throw new NotAuthorized()
        }

        const sale = await this.getSaleById(saleId, user)

        if (!sale) {
            throw new Error("Sale not found")
        }

        const machine = await this.machineService.getMachineById(sale.machine_id, user)

        if (!machine) {
            throw new Error("Machine not found")
        }

        return machine
    }


    async getItemSales(input, user) {

        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        const {period,  machineGroupId} = input

        const {sequelize} = this.Sale
        const {Op} = sequelize
        const where = {}
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
        let machines = await this.machineService.getAllMachinesOfUser(user)
        if(machineGroupId){
            machines = machines.filter(mach => mach.machine_group_id == machineGroupId)
        }

        where.machine_id = {
            [Op.in]: machines.map(machine => machine.id)
        }

        const userItems = await this.Item.findAll({
            where:{
                user_id: user.id
            }
        })

        const sales = await this.Sale.findAll({
            where
        })

        const summary = []

        for( let item of userItems ){
            const itemSales = sales.filter(sale => sale.item_id === item.id)
            const itemSale = {
                id: item.id,
                lastSaleTime: new Date(2011, 0, 1),
                name: item.name,
                salesSummary:{
                    cashAmount: 0,
                    cashlessAmount: 0,
                    overallAmount: 0,
                    salesCount: 0
                }
            }
            for (let sal of itemSales){

                const time = sal.createdAt.getTime()
                const thisTime = itemSale.lastSaleTime.getTime()
                if(time > thisTime){
                    itemSale.lastSaleTime = sal.createdAt
                }


                if(sal.type === "CASH"){
                    itemSale.salesSummary.cashAmount = itemSale.salesSummary.cashAmount + Number(sal.price)
                }
                if(sal.type === "CASHLESS"){
                    itemSale.salesSummary.cashlessAmount =  itemSale.salesSummary.cashlessAmount  + Number(sal.price)
                }
                itemSale.salesSummary.overallAmount = itemSale.salesSummary.overallAmount + Number(sal.price)
                itemSale.salesSummary.salesCount++
            }
            summary.push(itemSale)

        }




        return summary
    }

    async getMachineItemSales(input, user) {

        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        const {period,  machineId} = input

        const {sequelize} = this.Sale
        const {Op} = sequelize
        const where = {}
        where.machine_id = machineId
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

        let machine = await this.machineService.getMachineById(machineId, user)
        const itemMatrix = await machine.getItemMatrix()
        const buttons = await itemMatrix.getButtons()
        const items = await this.Item.findAll({
            where:{
                id: {
                    [Op.in]: buttons.map(it => it.item_id)
                }
            }
        })

        where.item_id = {
            [Op.in]: items.map(it => it.id)
        }

        const sales = await this.Sale.findAll({
            where
        })

        const summary = []

        for( let item of items ){
            const itemSales = sales.filter(sale => sale.item_id === item.id)
            const itemSale = {
                id: item.id,
                lastSaleTime: new Date(2011, 0, 1),
                name: item.name,
                salesSummary:{
                    cashAmount: 0,
                    cashlessAmount: 0,
                    overallAmount: 0,
                    salesCount: 0
                }
            }
            for (let sal of itemSales){

                const time = sal.createdAt.getTime()
                const thisTime = itemSale.lastSaleTime.getTime()
                if(time > thisTime){
                    itemSale.lastSaleTime = sal.createdAt
                }


                if(sal.type === "CASH"){
                    itemSale.salesSummary.cashAmount = itemSale.salesSummary.cashAmount + Number(sal.price)
                }
                if(sal.type === "CASHLESS"){
                    itemSale.salesSummary.cashlessAmount =  itemSale.salesSummary.cashlessAmount  + Number(sal.price)
                }
                itemSale.salesSummary.overallAmount = itemSale.salesSummary.overallAmount + Number(sal.price)
                itemSale.salesSummary.salesCount++
            }
            summary.push(itemSale)

        }




        return summary
    }


    async getMachineSales(input, user) {

        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        const {period,  machineGroupId} = input
        const {sequelize} = this.Sale
        const {Op} = sequelize
        const where = {}
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
        let machines = await this.machineService.getAllMachinesOfUser(user)
        if(machineGroupId){
            machines = machines.filter(mach => mach.machine_group_id == machineGroupId)
        }

        where.machine_id = {
            [Op.in]: machines.map(machine => machine.id)
        }

        const sales = await this.Sale.findAll({
            where
        })
        const summary = []
        for( let mach of machines ){
            const machSales = sales.filter(sale => sale.machine_id === mach.id)
            const machSale = {
                id: mach.id,
                lastSaleTime: new Date(2011, 0, 1),
                name: mach.name,
                salesSummary:{
                    cashAmount: 0,
                    cashlessAmount: 0,
                    overallAmount: 0,
                    salesCount: 0
                }
            }
            for (let sal of machSales){

                const time = sal.createdAt.getTime()
                const thisTime = machSale.lastSaleTime.getTime()
                if(time > thisTime){
                    machSale.lastSaleTime = sal.createdAt
                }


                if(sal.type === "CASH"){
                    machSale.salesSummary.cashAmount = machSale.salesSummary.cashAmount + Number(sal.price)
                }
                if(sal.type === "CASHLESS"){
                    machSale.salesSummary.cashlessAmount =  machSale.salesSummary.cashlessAmount  + Number(sal.price)
                }
                machSale.salesSummary.overallAmount = machSale.salesSummary.overallAmount + Number(sal.price)
                machSale.salesSummary.salesCount++
            }
            summary.push(machSale)

        }




        return summary
    }

    async getEncashmentsSummary(input, user) {
        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }
        const {sequelize} = this.Sale
        const {Op} = sequelize

        const {period, machineId} = input
        const where = {}
        where.type = "CASH"
        where.machine_id = machineId

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

        const encashmentsCount = 0
        const encashmentsAmount = await this.Sale.findAll({
            where,
            attributes: [
                [sequelize.fn("sum", sequelize.col("sales.price")), "overallAmount"]
            ],
        })
        return {
            encashmentsAmount,
            encashmentsCount
        }

    }
    async cashInMachine(input, user) {
        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        const {machineId} = input

        const machineCash = await this.TempMachine.findOne({
            where: {
                machine_id: machineId
            }
        })
        if(!machineCash){
            return null
        }
        return machineCash.amount

    }

    async getSalesSummary(input, user) {
        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        const {machineId, period, itemId, machineGroupId} = input

        const {sequelize} = this.Sale
        const {Op} = sequelize

        const where = {}
        const machineGroupWhere = {}

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

        if (machineGroupId) {
            machineGroupWhere.id = machineGroupId
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
            group: ["type", "sales.item_id", "item.id", "machine.id", "machine->group.id"],
            include: [
                {
                    model: this.Item
                },
                {
                    required: true,
                    model: this.Machine,
                    include: [{
                        model: this.MachineGroup, as: "group",
                        where: machineGroupWhere
                    }]
                }
            ]
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
