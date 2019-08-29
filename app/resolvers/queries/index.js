const ControllerQueries = require("./ControllerQueries")
const ItemQueries = require("./ItemQueries")
const EquipmentQueries = require("./EquipmentQueries")
const UserQueries = require("./UserQueries")
const MachineQueries = require("./MachineQueries")
const KktQueries = require("./KktQueries")
const SaleQueries = require("./SaleQueries")

function Queries({ controllerService, itemMatrixService, equipmentService, revisionService, userService, machineService, kktService, saleService}) {

    const controllerQueries = new ControllerQueries({ controllerService, revisionService})
    const itemQueries = new ItemQueries({ itemMatrixService })
    const equipmentQueries = new EquipmentQueries({ equipmentService })
    const userQueries = new UserQueries({ userService })
    const machineQueries = new MachineQueries({ machineService })
    const kktQueries = new KktQueries({ kktService })
    const saleQueries = new SaleQueries({ saleService })

    return {
        ...controllerQueries,
        ...itemQueries,
        ...equipmentQueries,
        ...userQueries,
        ...machineQueries,
        ...kktQueries,
        ...saleQueries
    }
}

module.exports = Queries

