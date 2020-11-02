const NotAuthorized = require("../errors/NotAuthorized")
const MachineNotFound = require("../errors/MachineNotFound")
const MachineGroupNotFound = require("../errors/MachineGroupNotFound")
const InvalidPeriod = require("../errors/InvalidPeriod")
const MachineTypeNotFound = require("../errors/MachineTypeNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const EquipmentNotFound = require("../errors/EquipmentNotFound")
const Machine = require("../models/Machine")
const Encashment = require("../models/Encashment")
const MachineLog = require("../models/MachineLog")
const MachineGroup = require("../models/MachineGroup")
const MachineType = require("../models/MachineType")
const Permission = require("../enum/Permission")

class MachineService {

    constructor({MachineModel, redis, EncashmentModel, MachineGroupModel, MachineTypeModel, MachineLogModel, equipmentService, itemMatrixService, controllerService, itemService, SaleModel}) {
        this.Machine = MachineModel
        this.Encashment = EncashmentModel
        this.MachineGroup = MachineGroupModel
        this.MachineType = MachineTypeModel
        this.MachineLog = MachineLogModel
        this.equipmentService = equipmentService
        this.itemMatrixService = itemMatrixService
        this.itemService = itemService
        this.controllerService = controllerService
        this.redis = redis
        this.Sale = SaleModel

        this.createMachine = this.createMachine.bind(this)
        this.editMachine = this.editMachine.bind(this)
        this.deleteMachine = this.deleteMachine.bind(this)
        this.getMachineById = this.getMachineById.bind(this)
        this.getMachineByControllerId = this.getMachineByControllerId.bind(this)
        this.getAllMachinesOfUser = this.getAllMachinesOfUser.bind(this)
        this.createMachineGroup = this.createMachineGroup.bind(this)
        this.getMachineGroupById = this.getMachineGroupById.bind(this)
        this.getAllMachineGroupsOfUser = this.getAllMachineGroupsOfUser.bind(this)
        this.createMachineType = this.createMachineType.bind(this)
        this.getMachineTypeById = this.getMachineTypeById.bind(this)
        this.getAllMachineTypes = this.getAllMachineTypes.bind(this)
        this.addLog = this.addLog.bind(this)
        this.createEncashment = this.createEncashment.bind(this)
        this.getEncashmentById = this.getEncashmentById.bind(this)
        this.getMachineEncashments = this.getMachineEncashments.bind(this)
        this.getLastMachineEncashment = this.getLastMachineEncashment.bind(this)
        this.getBanknoteCollectorStatus = this.getBanknoteCollectorStatus.bind(this)
        this.getCoinCollectorStatus = this.getCoinCollectorStatus.bind(this)
    }

    async createMachine(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_MACHINE)) {
            throw new NotAuthorized()
        }

        return this.Machine.sequelize.transaction(async (transaction) => {
            const {number, name, place, groupId, typeId, equipmentId, controllerId, kktId} = input

            let machine = new Machine()

            machine.number = number
            machine.name = name
            machine.place = place
            machine.controller_id = controllerId
            machine.user_id = user.id
            if (kktId) {
                machine.kktId = kktId
            }


            const machineGroup = await this.getMachineGroupById(groupId, user)

            if (!machineGroup) {
                throw new MachineGroupNotFound()
            }

            const machineType = await this.getMachineTypeById(typeId, user)

            if (!machineType) {
                throw new MachineTypeNotFound()
            }

            const equipment = await this.equipmentService.findById(equipmentId, user)

            if (!equipment) {
                throw new EquipmentNotFound()
            }

            machine.equipment_id = equipment.id
            machine.machine_group_id = machineGroup.id
            machine.machine_type_id = machineType.id

            machine = await this.Machine.create(machine, {transaction})

            const itemMatrix = await this.itemMatrixService.createItemMatrix(machine.id, user, transaction)
            const item = await this.itemService.createItem({name: "Товар1"}, user, transaction)

            machine.item_matrix_id = itemMatrix.id

            await this.itemMatrixService.addButtonToItemMatrixTrx({itemMatrixId: itemMatrix.id, buttonId: 1, itemId: item.id, multiplier: 1}, user, transaction)

            return machine.save({transaction})
        })
    }


    async editMachine(input, user) {
        if (!user || !user.checkPermission(Permission.EDIT_MACHINE)) {
            throw new NotAuthorized()
        }

        const {machineId, controllerId, number, name, place, groupId, typeId, kktId, equipmentId} = input

        const machine = await this.getMachineById(machineId, user)

        if (!machine) {
            throw new MachineNotFound()
        }

        if (controllerId) {
            const controller = await this.controllerService.getControllerById(controllerId, user)

            if (!controller) {
                throw new ControllerNotFound()
            }

            machine.controller_id = controller.id
        } else {
            machine.controller_id = null
        }

        if (groupId) {
            const machineGroup = await this.getMachineGroupById(groupId, user)

            if (!machineGroup) {
                throw new MachineGroupNotFound()
            }

            machine.machine_group_id = machineGroup.id
        }


        if (equipmentId) {
            const equipment = await this.equipmentService.findById(equipmentId, user)

            if (!equipment) {
                throw new EquipmentNotFound()
            }

            machine.equipment_id = equipment.id
        }

        if (typeId) {
            const machineType = await this.getMachineTypeById(typeId, user)

            if (!machineType) {
                throw new MachineTypeNotFound()
            }

            machine.machine_type_id = machineType.id
        }

        if (number) {
            machine.number = number
        }

        if (name) {
            machine.name = name
        }

        if (place) {
            machine.place = place
        }

        machine.kktId = kktId

        return await machine.save()
    }

    async getAllMachinesOfUser(user, machineGroupId) {
        if (!user || !user.checkPermission(Permission.GET_ALL_SELF_MACHINES)) {
            throw new NotAuthorized()
        }

        const where = {
            user_id: user.id
        }

        if(machineGroupId){
            where.machine_group_id = machineGroupId
        }
        const machines = await this.Machine.findAll({
            where
        })
        const controllers = await this.controllerService.getAllOfCurrentUser(user)

        return  await Promise.all(machines.map(async (machine) => {
            machine.kktStatus = "ОТКЛ"
            machine.terminalStatus = "ОТКЛ"
            machine.error = "ОТКЛ"
            machine.encashment = "ОТКЛ"

            const [controller] = controllers.filter(control => control.id === machine.controller_id)
            if(!controller) return machine

            machine.kktStatus = await this.redis.get("kkt_status_" + machine.id)
            machine.terminalStatus = await this.redis.get("terminal_status_" + machine.id)
            machine.encashment = await this.redis.get("machine_encashment_" + machine.id)
            machine.error = await this.redis.get("machine_error_" + machine.id)

            if(!machine.kktStatus) machine.kktStatus = "24H"
            if(!machine.terminalStatus)  machine.terminalStatus = "24H"
            if(!machine.encashment){
                machine.encashment = "31D"
            }


            if(!machine.error)  machine.error = "OK"

            if(controller.fiscalizationMode === "NO_FISCAL") machine.kktStatus = "ОТКЛ"
            if(controller.simCardNumber && controller.simCardNumber !== "0" && controller.simCardNumber !== "false") machine.terminalStatus += " (100руб/мес)"
            if(controller.bankTerminalMode ==="NO_BANK_TERMINAL") machine.terminalStatus = "ОТКЛ"
            return machine
        }))


    }

    async getMachineById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_BY_ID)) {
            throw new NotAuthorized()
        }

        const where = {
            id
        }

        if (!["ADMIN", "AGGREGATE"].some(role => user.role === role)) {
            where.user_id = user.id
        }

        return await this.Machine.findOne({
            where
        })
    }


    async getMachineByControllerId(controllerId, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_BY_CONTROLLER_ID)) {
            throw new NotAuthorized()
        }

        const where = {
            controller_id: controllerId,
        }

        if (!["ADMIN", "AGGREGATE"].some(role => user.role === role)) {
            where.user_id = user.id
        }

        const machine = await this.Machine.findOne({where})
        if(!machine) return null
        machine.kktStatus = await this.redis.get("kkt_status_" + machine.id)
        machine.terminalStatus = await this.redis.get("terminal_status_" + machine.id)
        machine.encashment = await this.redis.get("machine_encashment_" + machine.id)
        machine.error = await this.redis.get("machine_error_" + machine.id)

        if(!machine.kktStatus) machine.kktStatus = "24H"
        if(!machine.terminalStatus)  machine.terminalStatus = "24H"
        if(!machine.encashment) machine.encashment = "31D"
        if(!machine.error)  machine.error = "OK"

        return machine
    }

    async createMachineGroup(input, user, transaction) {
        if (!user || !user.checkPermission(Permission.CREATE_MACHINE_GROUP)) {
            throw new NotAuthorized()
        }

        const {name} = input

        const machineGroup = new MachineGroup()

        machineGroup.name = name
        machineGroup.user_id = user.id

        return await this.MachineGroup.create(machineGroup, {transaction})
    }

    async getMachineGroupById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_GROUP_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.MachineGroup.findOne({
            where: {
                id,
                user_id: user.id
            }
        })
    }

    async getAllMachineGroupsOfUser(user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_GROUP_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.MachineGroup.findAll({
            where: {
                user_id: user.id
            }
        })
    }

    async createMachineType(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_MACHINE_TYPE)) {
            throw new NotAuthorized()
        }

        const {name} = input

        const machineType = new MachineType()

        machineType.name = name

        return await this.MachineType.create(machineType)
    }


    async getMachineTypeById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_TYPE_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.MachineType.findOne({
            where: {
                id
            }
        })
    }

    async getAllMachineTypes(user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_TYPE_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.MachineType.findAll()
    }


    async deleteMachine(id, user) {
        if (!user || !user.checkPermission(Permission.DELETE_MACHINE)) {
            throw new NotAuthorized()
        }

        const machine = await this.getMachineById(id, user)

        if (!machine) {
            throw new MachineNotFound()
        }

        const controller = await machine.getController()

        if (controller) {
            machine.controller_id = null

            await machine.save()
        }

        await machine.destroy()
    }

    async addLog(machineId, message, type, user, transaction) {
        if (!user || !user.checkPermission(Permission.CREATE_MACHINE_LOG)) {
            throw new NotAuthorized()
        }

        const machineLog = new MachineLog()
        machineLog.message = message
        machineLog.machine_id = machineId
        machineLog.type = type

        return await this.MachineLog.create(machineLog, {transaction})
    }


    async createEncashment(machineId, timestamp, user) {
        if (!user || !user.checkPermission(Permission.CREATE_ENCASHMENT)) {
            throw new NotAuthorized()
        }

        const prevEncashment = await this.getLastMachineEncashment(machineId, user)
        const {sequelize} = this.Sale
        const {Op} = sequelize

        const encashment = new Encashment()
        encashment.timestamp = timestamp
        encashment.createdAt = new Date()
        encashment.machine_id = machineId

        if (prevEncashment) {
            encashment.prevEncashmentId = prevEncashment.id
        }
        const from = prevEncashment ? new Date(prevEncashment.timestamp) : new Date(0)
        const to = new Date(encashment.timestamp)

        const period = {from, to}

        const where = {}
        where.type = "CASH"
        where.machine_id = machineId

        if (period) {
            const {from, to} = period

            if (from > to) {
                throw new InvalidPeriod()
            }

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        const salesSummary = await this.Sale.findAll({
            where,
            attributes: [
                [sequelize.fn("sum", sequelize.col("sales.price")), "overallAmount"]
            ],
        })



        let encashmentsAmount = 0

        if(salesSummary && salesSummary[0] && salesSummary[0].dataValues && salesSummary[0].dataValues.overallAmount){
            encashmentsAmount = Number(salesSummary[0].dataValues.overallAmount)
        }
        encashment.sum = encashmentsAmount


        return await this.Encashment.create(encashment)
    }


    async getEncashmentById(encashmentId, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_ENCASHMENTS)) {
            throw new NotAuthorized()
        }

        return await this.Encashment.findOne({
            where: {
                id: encashmentId
            }
        })
    }

    async getLastMachineEncashment(machineId, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_ENCASHMENTS)) {
            throw new NotAuthorized()
        }

        return await this.Encashment.findOne({
            where: {
                machine_id: machineId
            },
            order: [
                ["id", "DESC"],
            ]
        })
    }

    async getMachineEncashments(machineId, user, period) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_ENCASHMENTS)) {
            throw new NotAuthorized()
        }
        const {sequelize} = this.Encashment
        const {Op} = sequelize

        const where = {
            machine_id: machineId
        }

        if (period) {
            const {from, to} = period

            if (from > to) {
                throw new InvalidPeriod()
            }

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        return await this.Encashment.findAll({
            where
        })
    }

    async getCoinCollectorStatus(machineId, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_ENCASHMENTS)) {
            throw new NotAuthorized()
        }

        return await this.redis.get("machine_coin_collector_status_" + machineId)
    }


    async getLogs(machineId, user, type, period) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_ENCASHMENTS)) {
            throw new NotAuthorized()
        }

        const {sequelize} = this.MachineLog
        const {Op} = sequelize

        const where = {
            machine_id: machineId
        }

        if(type && type !== "ALL"){
            where.type = type
        }

        if (period) {
            const {from, to} = period

            if (from > to) {
                throw new InvalidPeriod()
            }

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        const logs = await this.MachineLog.findAll({
            where
        })

        return logs
    }

    async getBanknoteCollectorStatus(machineId, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_ENCASHMENTS)) {
            throw new NotAuthorized()
        }

        return await this.redis.get("machine_banknote_collector_status_" + machineId)
    }
}

module.exports = MachineService
