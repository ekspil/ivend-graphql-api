const NotAuthorized = require("../errors/NotAuthorized")
const ItemMatrixNotFound = require("../errors/ItemMatrixNotFound")
const ButtonIdAlreadyBound = require("../errors/ButtonIdAlreadyBound")
const ButtonIdNotFound = require("../errors/ButtonIdNotFound")
const ItemNotFound = require("../errors/ItemNotFound")
const ItemMatrix = require("../models/ItemMatrix")
const ButtonItem = require("../models/ButtonItem")
const Permission = require("../enum/Permission")
const logger = require("../utils/logger")

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

    async createItemMatrix(machineId, user, transaction) {
        if (!user || !user.checkPermission(Permission.CREATE_ITEM_MATRIX)) {
            throw new NotAuthorized()
        }

        const itemMatrix = new ItemMatrix()
        itemMatrix.buttons = []
        itemMatrix.user_id = user.id
        itemMatrix.machine_id = machineId

        return await this.ItemMatrix.create(itemMatrix, {
            include: [
                {
                    model: this.ButtonItem,
                    as: "buttons"
                }
            ],
            transaction
        })
    }

    async addButtonToItemMatrix(input, user) {
        if (!user || !user.checkPermission(Permission.ADD_BUTTON_ITEM_TO_ITEM_MATRIX)) {
            throw new NotAuthorized()
        }

        const {itemMatrixId, buttonId, itemId} = input

        const item = await this.itemService.getItemById(itemId, user)

        if (!item) {
            throw new ItemNotFound()
        }

        const itemMatrix = await this.getItemMatrixById(itemMatrixId, user)

        if (!itemMatrix) {
            throw new ItemMatrixNotFound
        }

        const {buttons} = itemMatrix

        if (buttons.some(buttonItem => buttonItem.buttonId === buttonId)) {
            throw new ButtonIdAlreadyBound()
        }

        const buttonItem = new ButtonItem()
        buttonItem.buttonId = buttonId
        buttonItem.item_matrix_id = itemMatrix.id
        buttonItem.item_id = item.id

        await this.ButtonItem.create(buttonItem)

        return this.getItemMatrixById(itemMatrixId, user)
    }

    async removeButtonFromItemMatrix(input, user) {
        if (!user || !user.checkPermission(Permission.REMOVE_BUTTON_ITEM_FROM_ITEM_MATRIX)) {
            throw new NotAuthorized()
        }

        const {itemMatrixId, buttonId} = input

        const itemMatrix = await this.getItemMatrixById(itemMatrixId, user)

        if (!itemMatrix) {
            throw new ItemMatrixNotFound()
        }

        const {buttons} = itemMatrix

        if (!buttons.some(buttonItem => Number(buttonItem.buttonId) === Number(buttonId))) {
            throw new ButtonIdNotFound()
        }

        const [button] = buttons.filter(buttonItem => Number(buttonItem.buttonId) === Number(buttonId))

        if (!button) {
            logger.error("Unexpected situation, button from itemMatrix not found")
            throw new ButtonIdNotFound()
        }

        await itemMatrix.removeButton(button)

        return this.getItemMatrixById(itemMatrixId, user)
    }

    async getItemMatrixById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_ITEM_MATRIX_BY_ID)) {
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
