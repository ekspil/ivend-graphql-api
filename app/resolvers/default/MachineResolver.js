const MachineGroupDTO = require("../../models/dto/MachineGroupDTO")
const MachineTypeDTO = require("../../models/dto/MachineTypeDTO")
const EncashmentDTO = require("../../models/dto/EncashmentDTO")
const MachineLogDTO = require("../../models/dto/MachineLogDTO")
const EquipmentDTO = require("../../models/dto/EquipmentDTO")
const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")
const EncashmentSalesSummaryDTO = require("../../models/dto/EncashmentSalesSummaryDTO")
const ControllerDTO = require("../../models/dto/ControllerDTO")
const KktDTO = require("../../models/dto/KktDTO")

function MachineResolver({machineService, saleService, kktService}) {

    const group = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const machineGroup = await machine.getGroup()

        return new MachineGroupDTO(machineGroup)
    }
    const group2 = async (obj, args, context) => {
        const {user} = context

        const machineGroup = await machineService.getMachineGroupById(obj.machineGroup2Id, user)
        if(!machineGroup) return {id: null, name: "Нет"}
        return new MachineGroupDTO(machineGroup)
    }
    const group3 = async (obj, args, context) => {
        const {user} = context

        const machineGroup = await machineService.getMachineGroupById(obj.machineGroup3Id, user)
        if(!machineGroup) return {id: null, name: "Нет"}

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
        const {type, period} = args


        const logs = await machineService.getLogs(obj.id, user, type, period)

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
        const {period, machineGroupId} = args

        const salesSummary = await saleService.getSalesSummary({machineGroupId, machineId: obj.id, period}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }

    const machineItemSales = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const salesItemSummary = await saleService.getMachineItemSales({machineId: obj.id, period}, user)

        return salesItemSummary
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
        const {machineGroupId} = args

        const lastEncashment = await machineService.getLastMachineEncashment(obj.id, user)

        const period = {from: lastEncashment ? lastEncashment.timestamp : new Date(0), to: new Date()}

        const salesSummary = await saleService.getSalesSummary({machineGroupId, machineId: obj.id, period}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }

    const dataAfterEncashment = async (obj, args, context) => {
        const {user} = context

        const lastEncashment = await machineService.getLastMachineEncashment(obj.id, user)

        const period = {from: lastEncashment ? lastEncashment.timestamp : new Date(0), to: new Date()}



        const cash = await saleService.dataAfterEncashment({machineId: obj.id}, user)
        if(cash){
            return cash
        }



        const salesSummary = await saleService.getEncashmentsSummary({machineId: obj.id, period}, user)
        return salesSummary
    }


    const encashmentsSummaries = async (obj, args, context) => {
        const {user} = context
        const {interval} = args

        const encashments = await machineService.getMachineEncashments(obj.id, user, interval)

        return await Promise.all(encashments.map(async (encashment) => {
            const {prevEncashmentId} = encashment
            let prevEncashment = null
            if (prevEncashmentId) {
                prevEncashment = await machineService.getEncashmentById(prevEncashmentId, user)
            }
            const from = prevEncashment ? new Date(prevEncashment.timestamp) : new Date(0)
            const to = new Date(encashment.timestamp)

            const period = {from, to}

            const salesSummary = await saleService.getSalesSummary({machineId: obj.id, period}, user)
            return new EncashmentSalesSummaryDTO({encashment, salesSummary})
        }))

    }

    // const encashmentsSummariesFast = async (obj, args, context) => {
    //     const {user} = context
    //     const {interval} = args
    //     console.log("Before getEncachments for machine: " + obj.id)
    //     const encashments = await machineService.getMachineEncashments(obj.id, user, interval)
    //     console.log("Before PromiseAll for machine: " + obj.id)
    //
    //     for(let encashment of encashments){
    //         const {prevEncashmentId} = encashment
    //         let prevEncashment = null
    //         if (prevEncashmentId) {
    //             prevEncashment = await machineService.getEncashmentById(prevEncashmentId, user)
    //         }
    //         const from = prevEncashment ? new Date(prevEncashment.timestamp) : new Date(0)
    //         const to = new Date(encashment.timestamp)
    //
    //         const period = {from, to}
    //         console.log("PromiseAll before getSales for machine: " + obj.id)
    //         const salesSummary = await saleService.getEncashmentsSummary({machineId: obj.id, period}, user)
    //         let encashmentsAmount = 0
    //
    //         if(salesSummary && salesSummary.encashmentsAmount && salesSummary.encashmentsAmount[0] && salesSummary.encashmentsAmount[0].dataValues && salesSummary.encashmentsAmount[0].dataValues.overallAmount){
    //             encashmentsAmount = Number(salesSummary.encashmentsAmount[0].dataValues.overallAmount)
    //         }
    //
    //     }
    //     return await Promise.all(encashments.map(async (encashment) => {
    //         console.log("PromiseAll start for machine: " + obj.id)
    //         if(!encashment) return {encashmentsAmount: 0}
    //         const {prevEncashmentId} = encashment
    //         let prevEncashment = null
    //         if (prevEncashmentId) {
    //             prevEncashment = await machineService.getEncashmentById(prevEncashmentId, user)
    //         }
    //         const from = prevEncashment ? new Date(prevEncashment.timestamp) : new Date(0)
    //         const to = new Date(encashment.timestamp)
    //
    //         const period = {from, to}
    //         console.log("PromiseAll before getSales for machine: " + obj.id)
    //         const salesSummary = await saleService.getEncashmentsSummary({machineId: obj.id, period}, user)
    //         let encashmentsAmount = 0
    //
    //         if(salesSummary && salesSummary.encashmentsAmount && salesSummary.encashmentsAmount[0] && salesSummary.encashmentsAmount[0].dataValues && salesSummary.encashmentsAmount[0].dataValues.overallAmount){
    //             encashmentsAmount = Number(salesSummary.encashmentsAmount[0].dataValues.overallAmount)
    //
    //         }
    //         return {encashmentsAmount}
    //     }))
    //
    // }

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
        const {period} = args

        const encashments = await machineService.getMachineEncashments(obj.id, user, period)

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
    const coinCollectorStatus = async (obj, args, context) => {
        const {user} = context

        const status = await machineService.getCoinCollectorStatus(obj.id, user)
        if (!status) {
            return null
        }

        return status
    }
    const banknoteCollectorStatus = async (obj, args, context) => {
        const {user} = context

        const status = await machineService.getBanknoteCollectorStatus(obj.id, user)

        if (!status) {
            return null
        }

        return status
    }

    return {
        controller,
        lastSaleTime,
        salesSummary,
        salesSummaryOfItem,
        group,
        group2,
        group3,
        equipment,
        type,
        logs,
        itemMatrix,
        kkt,
        encashments,
        lastEncashment,
        salesByEncashment,
        encashmentsSummaries,
        coinCollectorStatus,
        banknoteCollectorStatus,
        machineItemSales,
        //encashmentsSummariesFast,
        dataAfterEncashment
    }

}

module.exports = MachineResolver

