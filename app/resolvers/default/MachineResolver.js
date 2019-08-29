const MachineGroupDTO = require("../../models/dto/MachineGroupDTO")
const MachineTypeDTO = require("../../models/dto/MachineTypeDTO")
const EncashmentDTO = require("../../models/dto/EncashmentDTO")
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


    const salesByEncashment = async (obj, args, context) => {
        const {user} = context

        const lastEncashment = await machineService.getLastMachineEncashment(obj.id, user)

        const period = {from: lastEncashment ? lastEncashment.timestamp : new Date(0), to: new Date()}

        const salesSummary = await saleService.getSalesSummary({machineId: obj.id, period}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }


    const salesByEncashmentForMachine = async (obj, args, context) => {
        const {user} = context

        const encashments = await machineService.getMachineEncashments(obj.id, user)

        return await Promise.all(encashments.map(async (encashment) => {
            const {prevEncashmentId} = encashment
            let prevEncashment = null

            if (prevEncashmentId) {
                prevEncashment = await this.machineService.getEncashmentById(prevEncashmentId)
            }

            const period = {from: prevEncashment ? prevEncashment.timestamp : new Date(0), to: new Date()}

            const salesSummary = await saleService.getSalesSummary({machineId: obj.id, period}, user)

            return new SalesSummaryDTO(salesSummary)
        }))

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

        if (!machine.kktId) {
            return null
        }

        const kkt = await kktService.getKktById(machine.kktId, user)

        if (!kkt) {
            return null
        }

        return new KktDTO(kkt)
    }

    const encashments = async (obj, args, context) => {
        const {user} = context

        const encashments = await machineService.getMachineEncashments(obj.id, user)

        if (!encashments) {
            return null
        }

        return encashments.map(encashment => (new EncashmentDTO(encashment)))
    }

    const lastEncashment = async (obj, args, context) => {
        const {user} = context

        const encashment = await machineService.getLastMachineEncashment(obj.id, user)

        if (!encashment) {
            return null
        }

        return new EncashmentDTO(encashment)
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
        kkt,
        encashments,
        lastEncashment,
        salesByEncashment,
        salesByEncashmentForMachine
    }

}

module.exports = MachineResolver

