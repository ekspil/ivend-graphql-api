const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")
const EquipmentMutations = require("./EquipmentMutations")
const ItemMutations = require("./ItemMutations")
const DepositMutations = require("./DepositMutations")
const MachineMutations = require("./MachineMutations")
const KktMutations = require("./KktMutations")
const NewsMutations = require("./NewsMutations")
const InfoMutations = require("./InfoMutations")
const InstrMutations = require("./InstrMutations")
const NotificationMutations = require("./NotificationMutations")
const PartnerMutations = require("./PartnerMutations")


function Mutations({userService, controllerService, equipmentService, saleService, itemService, itemMatrixService, revisionService, notificationSettingsService, legalInfoService, billingService, reportService, machineService, kktService, newsService, instrService, infoService, partnerService}) {

    const userMutations = new UserMutations({userService, notificationSettingsService, legalInfoService, reportService})
    const controllerMutations = new ControllerMutations({controllerService, saleService, revisionService})
    const equipmentMutations = new EquipmentMutations({equipmentService})
    const itemMutations = new ItemMutations({itemService, itemMatrixService, controllerService})
    const depositMutations = new DepositMutations({billingService})
    const machineMutations = new MachineMutations({machineService})
    const kktMutations = new KktMutations({kktService})
    const newsMutations = new NewsMutations({newsService})
    const instrMutations = new InstrMutations({instrService})
    const infoMutations = new InfoMutations({infoService})
    const notificationMutations = new NotificationMutations({notificationSettingsService})
    const partnerMutations = new PartnerMutations({userService, partnerService})


    return {
        ...userMutations,
        ...controllerMutations,
        ...equipmentMutations,
        ...itemMutations,
        ...depositMutations,
        ...machineMutations,
        ...kktMutations,
        ...newsMutations,
        ...infoMutations,
        ...instrMutations,
        ...notificationMutations,
        ...partnerMutations
    }
}

module.exports = Mutations

