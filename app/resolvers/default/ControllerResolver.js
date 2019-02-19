const ItemSaleStatDTO = require("../../models/dto/ItemSaleStatDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")

function ControllerResolver({saleService}) {

    const lastSaleTime = async (obj, args, context) => {
        const {user} = context

        const lastSale = await saleService.getLastSale(obj.id, user)

        if (lastSale) {
            return lastSale.createdAt
        }

        return null
    }

    const itemSaleStats = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const itemSaleStats = await saleService.getItemSaleStats({controllerId: obj.id, period}, user)

        return itemSaleStats.map(itemSaleStat => (new ItemSaleStatDTO(itemSaleStat)))
    }

    const salesSummary = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const salesSummary = await saleService.getSalesSummary({controllerId: obj.id, period}, user)

        return new SalesSummaryDTO(salesSummary)
    }

    return {
        lastSaleTime,
        itemSaleStats,
        salesSummary
    }

}

module.exports = ControllerResolver

