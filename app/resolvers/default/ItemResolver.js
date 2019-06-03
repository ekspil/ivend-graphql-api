const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")

function ItemResolver({saleService}) {

    const salesSummary = async (obj, args, context) => {
        const {user} = context
        const {machineId, period} = args

        const salesSummary = await saleService.getSalesSummary({machineId, itemId: obj.id, period}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }

    const lastSaleTime = async (obj, args, context) => {
        const {user} = context

        const lastSale = await saleService.getLastSaleOfItem(obj.id, user)

        if (!lastSale) {
            return null
        }

        return lastSale.createdAt
    }

    return {
        salesSummary,
        lastSaleTime
    }

}

module.exports = ItemResolver

