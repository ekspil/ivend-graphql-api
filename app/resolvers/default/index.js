const ControllerResolver = require("./ControllerResolver")
const UserResolver = require("./UserResolver")
const BillingResolver = require("./BillingResolver")
const MachineResolver = require("./MachineResolver")
const ItemMatrixResolver = require("./ItemMatrixResolver")
const ItemResolver = require("./ItemResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService, serviceService, itemService, machineService, itemMatrixService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService, serviceService, machineService})
    const userResolver = new UserResolver({notificationSettingsService, itemService})
    const billingResolver = new BillingResolver({billingService})
    const machineResolver = new MachineResolver({machineService, saleService})
    const itemMatrixResolver = new ItemMatrixResolver({itemMatrixService})
    const itemResolver = new ItemResolver({saleService})

    return {
        Controller: controllerResolver,
        User: userResolver,
        Billing: billingResolver,
        Machine: machineResolver,
        ItemMatrix: itemMatrixResolver,
        Item: itemResolver
    }
}

module.exports = DefaultResolvers
