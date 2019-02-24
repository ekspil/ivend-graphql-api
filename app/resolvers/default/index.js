const ControllerResolver = require("./ControllerResolver")
const ItemSalesStatResolver = require("./ItemSalesStatResolver")
const UserResolver = require("./UserResolver")
const BillingResolver = require("./BillingResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService})
    const itemSalesStatResolver = new ItemSalesStatResolver({saleService})
    const userResolver = new UserResolver({notificationSettingsService, billingService})
    const billingResolver = new BillingResolver({billingService})

    return {
        Controller: controllerResolver,
        ItemSalesStat: itemSalesStatResolver,
        User: userResolver,
        Billing: billingResolver
    }
}

module.exports = DefaultResolvers
