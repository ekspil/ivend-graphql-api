const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")
const FiscalRegistrarMutations = require("./FiscalRegistrarMutations")
const BankTerminalMutations = require("./BankTerminalMutations")
const ItemMutations = require("./ItemMutations")
const DepositMutations = require("./DepositMutations")
const MachineMutations = require("./MachineMutations")

function Mutations({userService, controllerService, equipmentService, fiscalRegistrarService, bankTerminalService, saleService, itemService, itemMatrixService, revisionService, notificationSettingsService, legalInfoService, billingService, reportService, machineService}) {

    const userMutations = new UserMutations({userService, notificationSettingsService, legalInfoService, reportService})
    const controllerMutations = new ControllerMutations({controllerService, saleService, revisionService})
    const equipmentMutations = new EquipmentMutations({equipmentService})
    const fiscalRegistrarMutations = new FiscalRegistrarMutations({fiscalRegistrarService})
    const bankTerminalMutations = new BankTerminalMutations({bankTerminalService})
    const itemMutations = new ItemMutations({itemService, itemMatrixService, controllerService})
    const depositMutations = new DepositMutations({billingService})
    const machineMutations = new MachineMutations({machineService})


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations,
        ...fiscalRegistrarMutations,
        ...bankTerminalMutations,
        ...itemMutations,
        ...depositMutations,
        ...machineMutations
    }
}

module.exports = Mutations

