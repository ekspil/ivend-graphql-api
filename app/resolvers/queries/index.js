const ControllerQueries = require("./ControllerQueries")
const ItemQueries = require("./ItemQueries")
const EquipmentQueries = require("./EquipmentQueries")
const UserQueries = require("./UserQueries")
const MachineQueries = require("./MachineQueries")
const KktQueries = require("./KktQueries")

function Queries({ controllerService, itemMatrixService, equipmentService, revisionService, userService, machineService, kktService}) {

    const controllerQueries = new ControllerQueries({ controllerService, revisionService})
    const itemQueries = new ItemQueries({ itemMatrixService })
    const equipmentQueries = new EquipmentQueries({ equipmentService })
    const userQueries = new UserQueries({ userService })
    const machineQueries = new MachineQueries({ machineService })
    const kktQueries = new KktQueries({ kktService })

    return {
        ...controllerQueries,
        ...itemQueries,
        ...equipmentQueries,
        ...userQueries,
        ...machineQueries,
        ...kktQueries
    }
}

module.exports = Queries

