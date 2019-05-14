const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")
const ItemMutations = require("./ItemMutations")
const DepositMutations = require("./DepositMutations")
const MachineMutations = require("./MachineMutations")
const KktMutations = require("./KktMutations")

function Mutations({userService, controllerService, equipmentService, saleService, itemService, itemMatrixService, revisionService, notificationSettingsService, legalInfoService, billingService, reportService, machineService, kktService}) {

    const userMutations = new UserMutations({userService, notificationSettingsService, legalInfoService, reportService})
    const controllerMutations = new ControllerMutations({controllerService, saleService, revisionService})
    const equipmentMutations = new EquipmentMutations({equipmentService})
    const itemMutations = new ItemMutations({itemService, itemMatrixService, controllerService})
    const depositMutations = new DepositMutations({billingService})
    const machineMutations = new MachineMutations({machineService})
    const kktMutations = new KktMutations({kktService})


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations,
        ...itemMutations,
        ...depositMutations,
        ...machineMutations,
        ...kktMutations
    }
}

module.exports = Mutations

