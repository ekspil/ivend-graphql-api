const MachineGroupDTO = require("../../models/dto/MachineGroupDTO")
const MachineTypeDTO = require("../../models/dto/MachineTypeDTO")
const MachineLogDTO = require("../../models/dto/MachineLogDTO")
const EquipmentDTO = require("../../models/dto/EquipmentDTO")
const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")
const ControllerDTO = require("../../models/dto/ControllerDTO")
const KktDTO = require("../../models/dto/KktDTO")

function MachineResolver({machineService, saleService, kktService}) {

    const group = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const machineGroup = await machine.getGroup()

        return new MachineGroupDTO(machineGroup)
    }

    const equipment = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const equipment = await machine.getEquipment()

        return new EquipmentDTO(equipment)
    }

    const type = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const type = await machine.getType()

        return new MachineTypeDTO(type)
    }

    const logs = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const logs = await machine.getLogs()

        return logs.map(log => (new MachineLogDTO(log)))
    }

    const itemMatrix = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const itemMatrix = await machine.getItemMatrix()

        if (!itemMatrix) {
            return null
        }

        return new ItemMatrixDTO(itemMatrix)
    }

    const salesSummary = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const salesSummary = await saleService.getSalesSummary({machineId: obj.id, period}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }

    const salesSummaryOfItem = async (obj, args, context) => {
        const {user} = context
        const {itemId, period} = args

        const salesSummary = await saleService.getSalesSummary({machineId: obj.id, itemId: itemId, period}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }

    const lastSaleTime = async (obj, args, context) => {
        const {user} = context

        const sale = await saleService.getLastSale(obj.id, user)

        if (!sale) {
            return null
        }

        return sale.createdAt
    }


    const controller = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const controller = await machine.getController()

        if (!controller) {
            return null
        }

        return new ControllerDTO(controller)
    }
    const kkt = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const kkts = await kktService.getUsersKkt()
        const [kkt] = kkts.filter(kk => kk.id === machine.kktId)

        if (!kkt) {
            return null
        }

        return new KktDTO(kkt)
    }

    return {
        controller,
        lastSaleTime,
        salesSummary,
        salesSummaryOfItem,
        group,
        equipment,
        type,
        logs,
        itemMatrix,
        kkt
    }

}

module.exports = MachineResolver

