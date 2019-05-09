const ControllerResolver = require("./ControllerResolver")
const UserResolver = require("./UserResolver")
const BillingResolver = require("./BillingResolver")
const MachineResolver = require("./MachineResolver")
const ItemMatrixResolver = require("./ItemMatrixResolver")
const ItemResolver = require("./ItemResolver")
const DepositResolver = require("./DepositResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService, serviceService, itemService, machineService, itemMatrixService, kktService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService, serviceService, machineService})
    const userResolver = new UserResolver({notificationSettingsService, itemService, saleService, kktService})
    const billingResolver = new BillingResolver({billingService})
    const machineResolver = new MachineResolver({machineService, saleService})
    const itemMatrixResolver = new ItemMatrixResolver({itemMatrixService})
    const itemResolver = new ItemResolver({saleService})
    const depositResolver = new DepositResolver({billingService})

    return {
        Controller: controllerResolver,
        User: userResolver,
        Billing: billingResolver,
        Machine: machineResolver,
        ItemMatrix: itemMatrixResolver,
        Item: itemResolver,
        Deposit: depositResolver
    }
}

module.exports = DefaultResolvers
