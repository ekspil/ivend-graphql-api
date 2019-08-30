const ReceiptDTO = require("../../models/dto/ReceiptDTO")
const ItemDTO = require("../../models/dto/ItemDTO")
const ControllerDTO = require("../../models/dto/ControllerDTO")

function SaleResolver({saleService}) {

    const receipt = async (obj, args, context) => {
        const {user} = context

        const receipt = await saleService.getReceiptOfSale(obj.id, user)

        if (!receipt) {
            return null
        }

        return new ReceiptDTO(receipt)
    }

    const item = async (obj, args, context) => {
        const {user} = context

        const item = await saleService.getItemOfSale(obj.id, user)

        return new ItemDTO(item)
    }

    const controller = async (obj, args, context) => {
        const {user} = context

        const controller = await saleService.getControllerOfSale(obj.id, user)

        return new ControllerDTO(controller)
    }

    return {
        receipt,
        item,
        controller
    }

}

module.exports = SaleResolver
