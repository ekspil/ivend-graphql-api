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
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, price} = input

        const item = new Item()
        item.name = name
        item.price = price
        item.userId = user.id

        return await this.Item.create(item)
    }

    async getItemById(id, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.Item.findOne({
            where: {
                id
            }
        })
    }

}

module.exports = ItemService
