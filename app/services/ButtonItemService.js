const NotAuthorized = require("../errors/NotAuthorized")
const ButtonItem = require("../models/ButtonItem")
const Permission = require("../enum/Permission")

class ButtonItemService {

    constructor({buttonItemRepository, itemRepository, itemMatrixRepository}) {
        this.buttonItemRepository = buttonItemRepository
        this.itemRepository = itemRepository
        this.itemMatrixRepository = itemMatrixRepository

        this.createButtonItem = this.createButtonItem.bind(this)
        this.getButtonItemById = this.getButtonItemById.bind(this)
        this.getButtonItemsByItemMatrix = this.getButtonItemsByItemMatrix.bind(this)
    }

    async createButtonItem(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {buttonId, itemId, itemMatrixId} = input

        const item = await this.itemRepository.findOne({id: itemId})

        if (!item) {
            throw new Error("Item not found")
        }

        const itemMatrix = await this.itemMatrixRepository.findOne({id: itemMatrixId})

        if (!itemMatrix) {
            throw new Error("ItemMatrix not found")
        }

        const buttonItem = new ButtonItem()
        buttonItem.buttonId = buttonId
        buttonItem.item = item
        buttonItem.itemMatrix = itemMatrix

        return await this.buttonItemRepository.save(buttonItem)
    }

    async getButtonItemById(id, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.buttonItemRepository.findOne({id})
    }

    async getButtonItemsByItemMatrix(itemMatrix, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.buttonItemRepository.find({
            where: {
                itemMatrix
            }
        })
    }


}

module.exports = ButtonItemService
