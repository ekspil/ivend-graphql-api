
function ControllerResolver({saleService}) {

    const lastSaleTime = async (obj, args, context) => {
        const {user} = context

        const lastSale = await saleService.getLastSale(obj.id, user)

        if(lastSale) {
            return lastSale.createdAt
        }

        return null
    }

    return {
        lastSaleTime
    }

}

module.exports = ControllerResolver

