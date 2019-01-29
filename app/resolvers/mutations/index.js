const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")
const FiscalRegistrarMutations = require("./FiscalRegistrarMutations")
const BankTerminalMutations = require("./BankTerminalMutations")

function Mutations({userService, controllerService, equipmentService, fiscalRegistrarService, bankTerminalService}) {

    const userMutations = new UserMutations({userService})
    const controllerMutations = new ControllerMutations({controllerService})
    const equipmentMutations = new EquipmentMutations({equipmentService})
    const fiscalRegistrarMutations = new FiscalRegistrarMutations({fiscalRegistrarService})
    const bankTerminalMutations = new BankTerminalMutations({bankTerminalService})


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations,
        ...fiscalRegistrarMutations,
        ...bankTerminalMutations
    }
}

module.exports = Mutations

