const ControllerQueries = require("./ControllerQueries")
const ItemQueries = require("./ItemQueries")
const EquipmentQueries = require("./EquipmentQueries")
const UserQueries = require("./UserQueries")

function Queries({ controllerService, itemMatrixService, equipmentService, revisionService, userService}) {

    const controllerQueries = new ControllerQueries({ controllerService, revisionService})
    const itemQueries = new ItemQueries({ itemMatrixService })
    const equipmentQueries = new EquipmentQueries({ equipmentService })
    const userQueries = new UserQueries({ userService })

    return {
        ...controllerQueries,
        ...itemQueries,
        ...equipmentQueries,
        ...userQueries
    }
}

module.exports = Queries

