const ControllerResolver = require("./ControllerResolver")
const ItemSalesStatResolver = require("./ItemSalesStatResolver")

function DefaultResolvers({controllerService, saleService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService})
    const itemSalesStatResolver = new ItemSalesStatResolver({saleService})

    return {
        Controller: controllerResolver,
        ItemSalesStat: itemSalesStatResolver
    }
}

module.exports = DefaultResolvers
