const ControllerQueries = require("./ControllerQueries")
const ItemQueries = require("./ItemQueries")
const EquipmentQueries = require("./EquipmentQueries")
const UserQueries = require("./UserQueries")
const MachineQueries = require("./MachineQueries")
const KktQueries = require("./KktQueries")
const NewsQueries = require("./NewsQueries")
const InfoQueries = require("./InfoQueries")
const InstrQueries = require("./InstrQueries")
const SaleQueries = require("./SaleQueries")
const PartnerQueries = require("./PartnerQueries")


function Queries({ controllerService, itemMatrixService, equipmentService, revisionService, userService, machineService, kktService, saleService, newsService, infoService, instrService, partnerService, billingService}) {

    const controllerQueries = new ControllerQueries({ controllerService, revisionService})
    const itemQueries = new ItemQueries({ itemMatrixService })
    const equipmentQueries = new EquipmentQueries({ equipmentService })
    const userQueries = new UserQueries({ userService, billingService })
    const machineQueries = new MachineQueries({ machineService })
    const kktQueries = new KktQueries({ kktService })
    const newsQueries = new NewsQueries({ newsService })
    const infoQueries = new InfoQueries({ infoService })
    const instrQueries = new InstrQueries({ instrService })
    const saleQueries = new SaleQueries({ saleService })
    const partnerQueries = new PartnerQueries({ partnerService })

    return {
        ...controllerQueries,
        ...itemQueries,
        ...equipmentQueries,
        ...userQueries,
        ...machineQueries,
        ...kktQueries,
        ...newsQueries,
        ...saleQueries,
        ...infoQueries,
        ...instrQueries,
        ...partnerQueries
    }
}

module.exports = Queries

