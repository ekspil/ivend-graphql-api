const ControllerResolver = require("./ControllerResolver")
const ItemSalesStatResolver = require("./ItemSalesStatResolver")
const UserResolver = require("./UserResolver")
const BillingResolver = require("./BillingResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService, serviceService, itemService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService, serviceService})
    const itemSalesStatResolver = new ItemSalesStatResolver({saleService})
    const userResolver = new UserResolver({notificationSettingsService, itemService})
    const billingResolver = new BillingResolver({billingService})

    return {
        Controller: controllerResolver,
        ItemSalesStat: itemSalesStatResolver,
        User: userResolver,
        Billing: billingResolver
    }
}

module.exports = DefaultResolvers
