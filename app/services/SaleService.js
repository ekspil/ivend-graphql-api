const NotAuthorized = require("../errors/NotAuthorized")
const ItemNotFound = require("../errors/ItemNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const ItemMatrixNotFound = require("../errors/ItemMatrixNotFound")
const OFDUnknownStatus = require("../errors/OFDUnknownStatus")
const Sale = require("../models/Sale")
const ButtonItem = require("../models/ButtonItem")
const Permission = require("../enum/Permission")
const ItemSaleStat = require("../models/ItemSaleStat")
const SalesSummary = require("../models/SalesSummary")
const logger = require("../utils/logger")
const fetch = require("node-fetch")

class SaleService {

    constructor({SaleModel, ButtonItemModel, ItemModel, controllerService, itemService}) {
        this.Sale = SaleModel
        this.Item = ItemModel
        this.ButtonItem = ButtonItemModel
        this.controllerService = controllerService
        this.itemService = itemService

        this.createSale = this.createSale.bind(this)
        this.registerSale = this.registerSale.bind(this)
        this.getLastSale = this.getLastSale.bind(this)
        this.getLastSaleOfItem = this.getLastSaleOfItem.bind(this)
        this.getItemSaleStats = this.getItemSaleStats.bind(this)


        // Create OFD auth
        this
            ._authOFD()
            .then(({AuthToken, ExpirationDateUtc}) => {
                this.OFD = {AuthToken, ExpirationDateUtc}
            })
            .catch(e => {
                logger.error(e)
                process.exit(1)
            })

    }

    async _authOFD() {
        const response = await fetch(`https://ferma.ofd.ru/api/Authorization/CreateAuthToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                Login: process.env.OFD_LOGIN,
                Password: process.env.OFD_PASSWORD
            })
        })

        if (!(response.status === 200)) {
            throw new OFDUnknownStatus()
        }

        const resp = await response.json()
        return resp.Data
    }

    async _registerReceiptOFD(sale, controller, user) {
        if (!this.OFD) {
            logger.error("OFD is not authenticated yet")
            throw new Error("Internal server error")
        }
        const {ExpirationDateUtc} = this.OFD

        if (ExpirationDateUtc) {
            const date = new Date(ExpirationDateUtc)
            if (new Date() > date) {
                logger.info(`OFD token expired, requesting again [${new Date()}]`)
                const {AuthToken, ExpirationDateUtc} = await this._authOFD()
                this.OFD = {AuthToken, ExpirationDateUtc}
            }
        }

        const legalInfo = await controller.user.getLegalInfo()

        if (!legalInfo) {
            throw new Error("LegalInfo is not set")
        }

        const body = {
            Request: {
                Inn: legalInfo.inn,
                Type: "Income",
                InvoiceId: `${controller.uid}.${new Date()}`,
                LocalDate: new Date(),
                CustomerReceipt: {
                    TaxationSystem: "Common",
                    Email: controller.uid === "10000026-1217" ? "admin@avtobar.ru" : "pay@ivend.pro",
                    Phone: user.phone,
                    Items: [
                        {
                            Label: "string",
                            Price: sale.price,
                            Quantity: 1,
                            Amount: sale.price,
                            Vat: "Vat0"
                        }
                    ]
                }
            }
        }

        const response = await fetch(`https://ferma.ofd.ru/api/kkt/cloud/receipt?AuthToken=${this.OFD.AuthToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(body)
        })


        return await response.json()
    }

    async _checkReceiptOFD(receiptID) {
        const body = {
            Request: {
                ReceiptId: receiptID
            }
        }

        const response = await fetch(`https://ferma.ofd.ru/api/kkt/cloud/status?AuthToken=${this.OFD.AuthToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(body)
        })


        return await response.json()
    }

    async createSale(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_SALE)) {
            throw new NotAuthorized()
        }

        const {buttonId, type, price, itemId, itemMatrixId, controllerId, time} = input

        const sale = new Sale()
        sale.buttonId = buttonId
        sale.type = type
        sale.price = price
        sale.item_id = itemId
        sale.item_matrix_id = itemMatrixId
        sale.controller_id = controllerId

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

        const {controllerUid, type, price, buttonId} = input

        const controller = await this.controllerService.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new ControllerNotFound
        }

        const {itemMatrix} = controller

        if (!itemMatrix) {
            throw new ItemMatrixNotFound()
        }

        const {buttons} = itemMatrix

        if (!buttons.some((buttonItem) => buttonItem.buttonId === buttonId)) {
            const name = `Товар ${buttonId}`
            const item = await this.itemService.createItem({name}, user)

            const button = new ButtonItem()
            button.buttonId = buttonId
            button.item_id = item.id
            button.item_matrix_id = itemMatrix.id

            const buttonItem = await this.ButtonItem.create(button, user)

            buttons.push(buttonItem)
        }

        const [itemId] = buttons
            .filter((buttonItem) => buttonItem.buttonId === buttonId)
            .map(buttonItem => buttonItem.item_id)

        if (!itemId) {
            logger.error("Unexpected situation, ItemId for sale not found")
            throw new ItemNotFound()
        }

        const sale = new Sale()
        sale.buttonId = buttonId
        sale.type = type
        sale.price = price
        sale.item_id = itemId
        sale.item_matrix_id = itemMatrix.id
        sale.controller_id = controller.id

        const lastState = await controller.getLastState()

        if (lastState && lastState.firmwareId !== "emulator") {
            //register sale on OFD
            const resp = await this._registerReceiptOFD(sale, controller, user)

            if (resp.Error) {
                logger.error(`Error response from OFD: [${resp.Error.Code}]` + resp.Error.Message)
                throw new Error("Internal server error")
            }

            logger.info(JSON.stringify(resp))
            const {ReceiptId} = resp.Data

            const receiptInfo = await this._checkReceiptOFD(ReceiptId)
            if (receiptInfo.Error) {
                logger.error(`Error response from OFD: [${resp.Error.Code}]` + resp.Error.Message)
                throw new Error("Internal server error")
            }
            logger.info(JSON.stringify(receiptInfo))
            const {Data} = receiptInfo
            const {Device} = resp

            const sqr = `t=${Data.ReceiptDateUtc}&s=${price}&fn=${Device.FN}&i=${Device.FDN}&fp=${Device.FPD}&n=1`

            const createdSale = await this.Sale.create(sale)

            createdSale.sqr = sqr

            return createdSale
        }

        return await this.Sale.create(sale)
    }


    async getLastSale(controllerId, user) {
        if (!user || !user.checkPermission(Permission.GET_LAST_SALE)) {
            throw new NotAuthorized()
        }

        return await this.Sale.findOne({
            where: {controller_id: controllerId},
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

    async getItemSaleStats(input, user) {
        if (!user || !user.checkPermission(Permission.GET_ITEM_SALE_STATS)) {
            throw new NotAuthorized()
        }

        const {controllerId, period} = input

        const {sequelize} = this.Sale
        const {Op} = sequelize

        const where = {
            controller_id: controllerId
        }

        if (period) {
            const {from, to} = period

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        const sales = await this.Sale.findAll({
            where,
            attributes: ["item_id", [sequelize.fn("COUNT", "sales.id"), "amount"]],
            group: ["item_id", "item.id"],
            include: [{model: this.Item}],
        })

        //todo move out to default resolver
        return await Promise.all(sales.map(async sale => {
            const itemId = sale.item.id
            const salesSummaryByItem = await this.getSalesSummary({controllerId, period, itemId}, user)
            return (new ItemSaleStat(sale.item, salesSummaryByItem))
        }))

    }

    async getSalesSummary(input, user) {
        if (!user || !user.checkPermission(Permission.GET_SALES_SUMMARY)) {
            throw new NotAuthorized()
        }

        const {controllerId, period, itemId} = input

        const {sequelize} = this.Sale
        const {Op} = sequelize

        const where = {
            controller_id: controllerId
        }

        if (itemId) {
            where.item_id = itemId
        }

        if (period) {
            const {from, to} = period

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
