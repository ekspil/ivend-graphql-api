const ControllerResolver = require("./ControllerResolver")
const UserResolver = require("./UserResolver")
const BillingResolver = require("./BillingResolver")
const MachineResolver = require("./MachineResolver")
const ItemMatrixResolver = require("./ItemMatrixResolver")
const ItemResolver = require("./ItemResolver")
const DepositResolver = require("./DepositResolver")
const EncashmentResolver = require("./EncashmentResolver")
const SaleResolver = require("./SaleResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService, serviceService, itemService, machineService, itemMatrixService, kktService, userService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService, serviceService, machineService})
    const userResolver = new UserResolver({notificationSettingsService, itemService, saleService, kktService, userService, billingService})
    const billingResolver = new BillingResolver({billingService})
    const machineResolver = new MachineResolver({machineService, saleService, kktService})
    const itemMatrixResolver = new ItemMatrixResolver({itemMatrixService})
    const itemResolver = new ItemResolver({saleService})
    const depositResolver = new DepositResolver({billingService})
    const encashmentResolver = new EncashmentResolver({machineService})
    const saleResolver = new SaleResolver({saleService})

    return {
        Controller: controllerResolver,
        User: userResolver,
        Billing: billingResolver,
        Machine: machineResolver,
        ItemMatrix: itemMatrixResolver,
        Item: itemResolver,
        Deposit: depositResolver,
        Encashment: encashmentResolver,
        Sale: saleResolver
    }
}

module.exports = DefaultResolvers
