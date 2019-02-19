const NotAuthorized = require("../errors/NotAuthorized")
const Sale = require("../models/Sale")
const Permission = require("../enum/Permission")
const ItemSaleStat = require("../models/ItemSaleStat")

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

        return sales.map(sale => {
            return (new ItemSaleStat(sale.item, Number(sale.dataValues.amount)))
        })

    }

}

module.exports = SaleService
