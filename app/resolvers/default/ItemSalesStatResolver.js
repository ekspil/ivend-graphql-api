function ItemSalesStatResolver({saleService}) {

    const lastSaleTime = async (obj, args, context) => {
        const {user} = context

        const lastSale = await saleService.getLastSaleOfItem(obj.item.id, user)

        return lastSale.createdAt
    }

    return {
        lastSaleTime,
    }

}

module.exports = ItemSalesStatResolver

