const MachineGroupDTO = require("../../models/dto/MachineGroupDTO")
const MachineTypeDTO = require("../../models/dto/MachineTypeDTO")
const MachineLogDTO = require("../../models/dto/MachineLogDTO")
const EquipmentDTO = require("../../models/dto/EquipmentDTO")
const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")

function MachineResolver({machineService, saleService}) {

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

    const logs = async () => {
        //const {user} = context

        //const machine = await machineService.getMachineById(obj.id, user)

        const logs = []

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

        const salesSummary = await saleService.getSalesSummary({machineId: obj.id}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }

    return {
        salesSummary,
        group,
        equipment,
        type,
        logs,
        itemMatrix
    }

}

module.exports = MachineResolver

