const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")
const FiscalRegistrarMutations = require("./FiscalRegistrarMutations")

function Mutations({userService, controllerService, equipmentService, fiscalRegistrarService}) {

    const userMutations = new UserMutations({userService})
    const controllerMutations = new ControllerMutations({controllerService})
    const equipmentMutations = new EquipmentMutations({equipmentService})
    const fiscalRegistrarMutations = new FiscalRegistrarMutations({fiscalRegistrarService})


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations,
        ...fiscalRegistrarMutations
    }
}

module.exports = Mutations

