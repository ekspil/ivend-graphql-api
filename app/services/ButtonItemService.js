const NotAuthorized = require("../errors/NotAuthorized")
const ButtonItem = require("../models/ButtonItem")
const Permission = require("../enum/Permission")

class ButtonItemService {

    constructor({ButtonItemModel, itemService, itemMatrixService}) {
        this.ButtonItem = ButtonItemModel
        this.itemService = itemService
        this.itemMatrixService = itemMatrixService

        this.createButtonItem = this.createButtonItem.bind(this)
        this.getButtonItemById = this.getButtonItemById.bind(this)
        this.getButtonItemsByItemMatrix = this.getButtonItemsByItemMatrix.bind(this)
    }

    async createButtonItem(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {buttonId, itemId, itemMatrixId} = input

        const item = await this.itemService.getItemById(itemId, user)

        if (!item) {
            throw new Error("Item not found")
        }

        const itemMatrix = await this.itemMatrixService.getItemMatrixById(itemMatrixId, user)

        if (!itemMatrix) {
            throw new Error("ItemMatrix not found")
        }

        const buttonItem = new ButtonItem()
        buttonItem.buttonId = buttonId
        buttonItem.item_id = item.id
        buttonItem.item_matrix_id = itemMatrix.id

        return await this.ButtonItem.create(buttonItem)
    }

    async getButtonItemById(id, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.ButtonItem.findOne({
            where: {
                id
            }
        })
    }

    async getButtonItemsByItemMatrix(itemMatrix, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.ButtonItem.find({
            where: {
                itemMatrix
            }
        })
    }


}

module.exports = ButtonItemService
