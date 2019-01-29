const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")

function Mutations({ userService, controllerService,equipmentService }) {

    const userMutations = new UserMutations({ userService })
    const controllerMutations = new ControllerMutations({ controllerService })
    const equipmentMutations = new EquipmentMutations({ equipmentService })


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations
    }
}

module.exports = Mutations

