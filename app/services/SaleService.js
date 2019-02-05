const NotAuthorized = require("../errors/NotAuthorized")
const Sale = require("../models/Sale")
const Permission = require("../enum/Permission")

class SaleService {

    constructor({saleRepository, controllerService, buttonItemService, itemService}) {
        this.saleRepository = saleRepository
        this.controllerService = controllerService
        this.buttonItemService = buttonItemService
        this.itemService = itemService

        this.registerSale = this.registerSale.bind(this)
    }

    async registerSale(input, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {controllerUid, buttonId} = input

        let controller = await this.controllerService.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new Error("Error not found")
        }

        const {itemMatrix} = controller

        if (!itemMatrix) {
            throw new Error("Item matrix not found in this controller")
        }

        const buttons = await this.buttonItemService.getButtonItemsByItemMatrix(itemMatrix, user)

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

        const [item] = buttons.filter((buttonItem) => buttonItem.buttonId === buttonId).map(buttonItem => buttonItem.item)

        const sale = new Sale()
        sale.buttonId = buttonId
        sale.item = item
        sale.itemMatrix = itemMatrix
        sale.controller = controller

        return await this.saleRepository.save(sale)
    }


}

module.exports = SaleService
