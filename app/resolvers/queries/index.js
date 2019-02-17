const ControllerQueries = require("./ControllerQueries")
const ItemQueries = require("./ItemQueries")
const EquipmentQueries = require("./EquipmentQueries")

function Queries({ controllerService, itemMatrixService, equipmentService }) {

    const controllerQueries = new ControllerQueries({ controllerService, itemMatrixService})
    const itemQueries = new ItemQueries({ itemMatrixService })
    const equipmentQueries = new EquipmentQueries({ equipmentService })

    return {
        ...controllerQueries,
        ...itemQueries,
        ...equipmentQueries
    }
}

module.exports = Queries

