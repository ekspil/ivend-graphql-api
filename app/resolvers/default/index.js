const ControllerResolver = require("./ControllerResolver")
const UserResolver = require("./UserResolver")
const BillingResolver = require("./BillingResolver")
const MachineResolver = require("./MachineResolver")
const ItemMatrixResolver = require("./ItemMatrixResolver")
const ItemResolver = require("./ItemResolver")
const DepositResolver = require("./DepositResolver")
const EncashmentResolver = require("./EncashmentResolver")
const SaleResolver = require("./SaleResolver")
const NewsResolver = require("./NewsResolver")

function DefaultResolvers({controllerService, saleService, notificationSettingsService, billingService, serviceService, itemService, machineService, itemMatrixService, kktService, userService, partnerService}) {
    const controllerResolver = new ControllerResolver({controllerService, saleService, serviceService, machineService})
    const userResolver = new UserResolver({controllerService, notificationSettingsService, itemService, saleService, kktService, userService, partnerService})
    const billingResolver = new BillingResolver({billingService})
    const machineResolver = new MachineResolver({machineService, saleService, kktService})
    const itemMatrixResolver = new ItemMatrixResolver({itemMatrixService})
    const itemResolver = new ItemResolver({saleService})
    const depositResolver = new DepositResolver({billingService})
    const encashmentResolver = new EncashmentResolver({machineService})
    const saleResolver = new SaleResolver({saleService})
    const newsResolver = new NewsResolver({userService})


    return {
        Controller: controllerResolver,
        User: userResolver,
        Billing: billingResolver,
        Machine: machineResolver,
        ItemMatrix: itemMatrixResolver,
        Item: itemResolver,
        Deposit: depositResolver,
        Encashment: encashmentResolver,
        Sale: saleResolver,
        News: newsResolver,
    }
}

module.exports = DefaultResolvers
