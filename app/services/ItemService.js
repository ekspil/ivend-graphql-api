const NotAuthorized = require("../errors/NotAuthorized")
const Item = require("../models/Item")
const Permission = require("../enum/Permission")

class ItemService {

    constructor({ItemModel}) {
        this.Item = ItemModel

        this.createItem = this.createItem.bind(this)
        this.getItemById = this.getItemById.bind(this)
    }

    async createItem(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_ITEM)) {
            throw new NotAuthorized()
        }

        const {name} = input

        const item = new Item()
        item.name = name
        item.user_id = user.id

        return await this.Item.create(item)
    }

    async getItemById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_ITEM_BY_ID)) {
            throw new NotAuthorized()
        }

        //todo reject if not authorized (user_id)

        return await this.Item.findOne({
            where: {
                id
            }
        })
    }

    async getUserItems(user) {
        if (!user || !user.checkPermission(Permission.GET_USER_ITEMS)) {
            throw new NotAuthorized()
        }

        return await this.Item.findAll({
            where: {
                user_id: user.id
            }
        })
    }

}

module.exports = ItemService
