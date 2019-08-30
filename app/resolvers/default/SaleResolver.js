const ReceiptDTO = require("../../models/dto/ReceiptDTO")

function SaleResolver({saleService}) {

    const receipt = async (obj, args, context) => {
        const {user} = context

        const receipt = await saleService.getReceiptOfSale(obj.id, user)

        if (!receipt) {
            return null
        }

        return new ReceiptDTO(receipt)
    }

    return {
        receipt
    }

}

module.exports = SaleResolver

