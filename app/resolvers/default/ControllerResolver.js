const ItemSaleStatDTO = require("../../models/dto/ItemSaleStatDTO")

function ControllerResolver({saleService}) {

    const lastSaleTime = async (obj, args, context) => {
        const {user} = context

        const lastSale = await saleService.getLastSale(obj.id, user)

        if (lastSale) {
            return lastSale.createdAt
        }

        return null
    }

    const saleStats = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const itemSaleStats = await saleService.getItemSaleStats({controllerId: obj.id, period}, user)

        return itemSaleStats.map(itemSaleStat => (new ItemSaleStatDTO(itemSaleStat)))
    }

    return {
        lastSaleTime,
        saleStats
    }

}

module.exports = ControllerResolver

