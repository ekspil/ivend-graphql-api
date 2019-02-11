const NotAuthorized = require("../errors/NotAuthorized")
const ItemMatrix = require("../models/ItemMatrix")
const Item = require("../models/Item")
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
        this.getItemFromMatrix = this.getItemFromMatrix.bind(this)
        this.createItemInItemMatrix = this.createItemInItemMatrix.bind(this)
    }

    async createItemMatrix(input, controller, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }


        let itemMatrix = new ItemMatrix()
        itemMatrix.buttons = []
        itemMatrix.user = user
        itemMatrix.controller_id = controller.id

        itemMatrix = await this.ItemMatrix.create(itemMatrix, {
            include: [
                {
                    model: this.ButtonItem,
                    as: "buttons"
                }
            ]
        })

        // todo Check that all itemIds are exist
        for (const createButtonItemInput of input.buttons) {
            const {buttonId, price, itemName} = createButtonItemInput

            const item = await this.itemService.createItem({name: itemName, price}, user)
            await itemMatrix.addButton({buttonId, itemId: item.id})
            const buttonItem = await this.buttonItemService.createButtonItem({
                buttonId,
                itemId: item.id,
                itemMatrixId: itemMatrix.id
            }, user)
            await itemMatrix.addButton(buttonItem)
            /*const buttonItem = await this.buttonItemService.createButtonItem({
                buttonId,
                itemId: item.id,
                itemMatrixId: itemMatrix.id
            }, user)*/
        }

        return itemMatrix
    }


    async createItemInItemMatrix(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {itemMatrixId, buttonId, itemName, price} = input

        let itemMatrix = await this.getItemMatrixById(itemMatrixId, user)

        if (!itemMatrix) {
            throw new Error("Item matrix not found")
        }

        const buttonItem = new ButtonItem()
        buttonItem.buttonId = buttonId
        buttonItem.itemMatrixId = itemMatrix.id

        const item = new Item()
        item.name = itemName
        item.price = price

        const resultItem = await this.itemService.createItem(item, user)


        buttonItem.itemId = resultItem.id

        const button = await itemMatrix.createButton(buttonItem)

        itemMatrix.buttons.push(button)

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
                        model: this.Item,
                        include: [{
                            model: this.User
                        }]
                    }]
                }
            ]
        })

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
