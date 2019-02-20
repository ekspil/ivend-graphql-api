const NotAuthorized = require("../errors/NotAuthorized")
const Sale = require("../models/Sale")
const Permission = require("../enum/Permission")
const ItemSaleStat = require("../models/ItemSaleStat")
const SalesSummary = require("../models/SalesSummary")

class SaleService {

    constructor({SaleModel, ItemModel, controllerService, buttonItemService, itemService}) {
        this.Sale = SaleModel
        this.Item = ItemModel
        this.controllerService = controllerService
        this.buttonItemService = buttonItemService
        this.itemService = itemService

        this.registerSale = this.registerSale.bind(this)
        this.getLastSale = this.getLastSale.bind(this)
        this.getItemSaleStats = this.getItemSaleStats.bind(this)
    }

    async registerSale(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {controllerUid, type, buttonId} = input

        let controller = await this.controllerService.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new Error("Error not found")
        }

        const {itemMatrix} = controller

        if (!itemMatrix) {
            throw new Error("Item matrix not found in this controller")
        }

        const {buttons} = itemMatrix

        if (!buttons.some((buttonItem) => buttonItem.buttonId === buttonId)) {
            const name = "New item"
            const price = 1
            const item = await this.itemService.createItem({name, price}, user)
            const buttonItem = await this.buttonItemService.createButtonItem({
                buttonId,
                itemId: item.id,
                itemMatrixId: itemMatrix.id
            }, user)
            buttons.push(buttonItem)
        }

        const [itemId] = buttons
            .filter((buttonItem) => buttonItem.buttonId === buttonId)
            .map(buttonItem => buttonItem.item_id)

        const sale = new Sale()
        sale.buttonId = buttonId
        sale.type = type
        sale.item_id = itemId
        sale.item_matrix_id = itemMatrix.id
        sale.controller_id = controller.id

        return await this.Sale.create(sale)
    }


    async getLastSale(controllerId, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.Sale.findOne({
            where: {controller_id: controllerId},
            order: [
                ["id", "DESC"],
            ]
        })
    }

    async getItemSaleStats(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
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
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {controllerId, period, itemId} = input

        const {sequelize} = this.Sale
        const {Op} = sequelize

        const where = {
            controller_id: controllerId
        }

        if(itemId) {
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
                [sequelize.fn("sum", sequelize.col("item.price")), "overallAmount"]
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
