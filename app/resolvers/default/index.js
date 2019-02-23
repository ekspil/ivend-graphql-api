const ControllerResolver = require("./ControllerResolver")
const ItemSalesStatResolver = require("./ItemSalesStatResolver")
const UserResolver = require("./UserResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService})
    const itemSalesStatResolver = new ItemSalesStatResolver({saleService})
    const userResolver = new UserResolver({notificationSettingsService, billingService})

    return {
        Controller: controllerResolver,
        ItemSalesStat: itemSalesStatResolver,
        User: userResolver
    }
}

module.exports = DefaultResolvers
