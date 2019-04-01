const ControllerResolver = require("./ControllerResolver")
const ItemSalesStatResolver = require("./ItemSalesStatResolver")
const UserResolver = require("./UserResolver")
const BillingResolver = require("./BillingResolver")
const MachineResolver = require("./MachineResolver")
const ItemMatrixResolver = require("./ItemMatrixResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService, serviceService, itemService, machineService, itemMatrixService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService, serviceService, machineService})
    const itemSalesStatResolver = new ItemSalesStatResolver({saleService})
    const userResolver = new UserResolver({notificationSettingsService, itemService})
    const billingResolver = new BillingResolver({billingService})
    const machineResolver = new MachineResolver({machineService})
    const itemMatrixResolver = new ItemMatrixResolver({itemMatrixService})

    return {
        Controller: controllerResolver,
        ItemSalesStat: itemSalesStatResolver,
        User: userResolver,
        Billing: billingResolver,
        Machine: machineResolver,
        ItemMatrix: itemMatrixResolver
    }
}

module.exports = DefaultResolvers
