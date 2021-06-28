const ReceiptDTO = require("../../models/dto/ReceiptDTO")
const ItemDTO = require("../../models/dto/ItemDTO")
const MachineDTO = require("../../models/dto/MachineDTO")

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

        const item = await saleService.getItemOfSale(obj.id, user, true)

        return new ItemDTO(item)
    }

    const machine = async (obj, args, context) => {
        const {user} = context

        const machine = await saleService.getMachineOfSale(obj.id, user)

        return new MachineDTO(machine)
    }

    return {
        receipt,
        item,
        machine
    }

}

module.exports = SaleResolver
