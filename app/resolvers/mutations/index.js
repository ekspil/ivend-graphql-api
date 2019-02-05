const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")
const FiscalRegistrarMutations = require("./FiscalRegistrarMutations")
const BankTerminalMutations = require("./BankTerminalMutations")
const ItemMutations = require("./ItemMutations")

function Mutations({userService, controllerService, equipmentService, fiscalRegistrarService, bankTerminalService, saleService, itemService, itemMatrixService}) {

    const userMutations = new UserMutations({userService})
    const controllerMutations = new ControllerMutations({controllerService, saleService})
    const equipmentMutations = new EquipmentMutations({equipmentService})
    const fiscalRegistrarMutations = new FiscalRegistrarMutations({fiscalRegistrarService})
    const bankTerminalMutations = new BankTerminalMutations({bankTerminalService})
    const itemMutations = new ItemMutations({itemService, itemMatrixService})


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations,
        ...fiscalRegistrarMutations,
        ...bankTerminalMutations,
        ...itemMutations
    }
}

module.exports = Mutations

