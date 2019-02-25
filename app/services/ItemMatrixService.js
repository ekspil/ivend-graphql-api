const NotAuthorized = require("../errors/NotAuthorized")
const ItemMatrix = require("../models/ItemMatrix")
const ButtonItem = require("../models/ButtonItem")
const Permission = require("../enum/Permission")

class ItemMatrixService {

    constructor({ItemMatrixModel, itemService, buttonItemService, ButtonItemModel, ItemModel, UserModel}) {
        this.Item = ItemModel
        this.User = UserModel
        this.ItemMatrix = ItemMatrixModel
        this.itemService = itemService
        this.ButtonItem = ButtonItemModel
        this.buttonItemService = buttonItemService

        this.createItemMatrix = this.createItemMatrix.bind(this)
        this.addButtonToItemMatrix = this.addButtonToItemMatrix.bind(this)
    }

    async createItemMatrix(controllerId, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const itemMatrix = new ItemMatrix()
        itemMatrix.buttons = []
        itemMatrix.user_id = user.id
        itemMatrix.controller_id = controllerId

        return await this.ItemMatrix.create(itemMatrix, {
            include: [
                {
                    model: this.ButtonItem,
                    as: "buttons"
                }
            ]
        })
    }

    async addButtonToItemMatrix(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {itemMatrixId, buttonId, itemId} = input

        const item = await this.itemService.getItemById(itemId, user)

        if (!item) {
            throw new Error("Item not found")
        }

        const itemMatrix = await this.getItemMatrixById(itemMatrixId, user)

        if (!itemMatrix) {
            throw new Error("Item matrix not found")
        }

        const {buttons} = itemMatrix

        if (buttons.some(buttonItem => buttonItem.buttonId === buttonId)) {
            throw new Error("Such buttonId already bound to this ItemMatrix")
        }

        const buttonItem = new ButtonItem()
        buttonItem.buttonId = buttonId
        buttonItem.item_matrix_id = itemMatrix.id
        buttonItem.item_id = item.id

        await this.ButtonItem.create(buttonItem)

        return this.getItemMatrixById(itemMatrixId, user)
    }

    async removeButtonFromItemMatrix(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {itemMatrixId, buttonId} = input

        const itemMatrix = await this.getItemMatrixById(itemMatrixId, user)

        if (!itemMatrix) {
            throw new Error("Item matrix not found")
        }

        const {buttons} = itemMatrix

        if (!buttons.some(buttonItem => buttonItem.buttonId === buttonId)) {
            throw new Error("No such buttonId in this ItemMatrix")
        }

        const [button] = buttons.filter(buttonItem => buttonItem.buttonId === buttonId)

        if (!button) {
            // eslint-disable-next-line no-console
            console.error("Unexpected situation, button from itemMatrix not found")
            throw new Error("Internal server error")
        }

        await itemMatrix.removeButton(button)

        return this.getItemMatrixById(itemMatrixId, user)
    }

    async getItemMatrixById(id, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const itemMatrix = await this.ItemMatrix.findOne({
            where: {id},
            include: [
                {
                    model: this.ButtonItem,
                    as: "buttons",
                    include: [{
                        model: this.Item
                    }]
                }
            ]
        })

        return itemMatrix
    }


}

module.exports = ItemMatrixService
