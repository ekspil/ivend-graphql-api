const NotAuthorized = require("../errors/NotAuthorized")
const Item = require("../models/Item")
const Permission = require("../enum/Permission")

class ItemService {

    constructor({itemRepository}) {
        this.itemRepository = itemRepository

        this.createItem = this.createItem.bind(this)
        this.getButtonItemById = this.getItemById.bind(this)
    }

    async createItem(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, price} = input

        const item = new Item()
        item.name = name
        item.price = price
        item.user = user

        return await this.itemRepository.save(item)
    }

    async getItemById(id, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.itemRepository.findOne({id})
    }


}

module.exports = ItemService
