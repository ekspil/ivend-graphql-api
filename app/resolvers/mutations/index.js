const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")
const FiscalRegistrarMutations = require("./FiscalRegistrarMutations")
const BankTerminalMutations = require("./BankTerminalMutations")
const ItemMutations = require("./ItemMutations")
const DepositMutations = require("./DepositMutations")

function Mutations({userService, controllerService, equipmentService, fiscalRegistrarService, bankTerminalService, saleService, itemService, itemMatrixService, revisionService, notificationSettingsService, legalInfoService, billingService}) {

    const userMutations = new UserMutations({userService, notificationSettingsService, legalInfoService})
    const controllerMutations = new ControllerMutations({controllerService, saleService, revisionService})
    const equipmentMutations = new EquipmentMutations({equipmentService})
    const fiscalRegistrarMutations = new FiscalRegistrarMutations({fiscalRegistrarService})
    const bankTerminalMutations = new BankTerminalMutations({bankTerminalService})
    const itemMutations = new ItemMutations({itemService, itemMatrixService, controllerService})
    const depositMutations = new DepositMutations({billingService})


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations,
        ...fiscalRegistrarMutations,
        ...bankTerminalMutations,
        ...itemMutations,
        ...depositMutations
    }
}

module.exports = Mutations

