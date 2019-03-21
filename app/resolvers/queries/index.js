const ControllerQueries = require("./ControllerQueries")
const ItemQueries = require("./ItemQueries")
const EquipmentQueries = require("./EquipmentQueries")
const UserQueries = require("./UserQueries")
const ServiceQueries = require("./ServiceQueries")
const MachineQueries = require("./MachineQueries")

function Queries({ controllerService, itemMatrixService, equipmentService, revisionService, userService, serviceService, machineService}) {

    const controllerQueries = new ControllerQueries({ controllerService, revisionService})
    const itemQueries = new ItemQueries({ itemMatrixService })
    const equipmentQueries = new EquipmentQueries({ equipmentService })
    const userQueries = new UserQueries({ userService })
    const serviceQueries = new ServiceQueries({ serviceService })
    const machineQueries = new MachineQueries({ machineService })

    return {
        ...controllerQueries,
        ...itemQueries,
        ...equipmentQueries,
        ...userQueries,
        ...serviceQueries,
        ...machineQueries
    }
}

module.exports = Queries

