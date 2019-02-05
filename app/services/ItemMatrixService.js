const NotAuthorized = require("../errors/NotAuthorized")
const ItemMatrix = require("../models/ItemMatrix")
const Permission = require("../enum/Permission")

class ItemMatrixService {

    constructor({itemMatrixRepository, itemService, buttonItemService}) {
        this.itemMatrixRepository = itemMatrixRepository
        this.itemService = itemService
        this.buttonItemService = buttonItemService

        this.createItemMatrix = this.createItemMatrix.bind(this)
        this.getItemFromMatrix = this.getItemFromMatrix.bind(this)
    }

    async createItemMatrix(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        let itemMatrix = new ItemMatrix()
        itemMatrix.buttons = []
        itemMatrix.user = user

        itemMatrix = await this.itemMatrixRepository.save(itemMatrix)

        // todo Check that all itemIds are exist
        for (const createButtonItemInput of input.buttons) {
            const {buttonId, price, itemName} = createButtonItemInput

            const item = await this.itemService.createItem({name: itemName, price}, user)
            const buttonItem = await this.buttonItemService.createButtonItem({
                buttonId,
                itemId: item.id,
                itemMatrixId: itemMatrix.id
            }, user)
            itemMatrix.buttons.push(buttonItem)
        }

        return itemMatrix
    }

    async getItemMatrixById(id, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const itemMatrix = await this.itemMatrixRepository.findOne({id})

        if (itemMatrix) {
            itemMatrix.buttons = await this.buttonItemService.getButtonItemsByItemMatrix(itemMatrix, user)
        }

        return itemMatrix
    }

    async getItemFromMatrix(itemMatrix, buttonId, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {map} = itemMatrix

        const itemId = map[buttonId]

        if (!itemId) {
            throw new Error(`Button with id ${buttonId} not registered on server`)
        }

        // Check that all ids are incremental
        // Check that all itemIds are exist
        return this.itemService.getButtonItemById(itemId, user)
    }


}

module.exports = ItemMatrixService
