const NotAuthorized = require("../errors/NotAuthorized")
const MachineNotFound = require("../errors/MachineNotFound")
const MachineGroupNotFound = require("../errors/MachineGroupNotFound")
const MachineTypeNotFound = require("../errors/MachineTypeNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const EquipmentNotFound = require("../errors/EquipmentNotFound")
const Machine = require("../models/Machine")
const MachineGroup = require("../models/MachineGroup")
const MachineType = require("../models/MachineType")
const Permission = require("../enum/Permission")

class MachineService {

    constructor({MachineModel, MachineGroupModel, MachineTypeModel, equipmentService, itemMatrixService, controllerService}) {
        this.Machine = MachineModel
        this.MachineGroup = MachineGroupModel
        this.MachineType = MachineTypeModel
        this.equipmentService = equipmentService
        this.itemMatrixService = itemMatrixService
        this.controllerService = controllerService

        this.createMachine = this.createMachine.bind(this)
        this.editMachine = this.editMachine.bind(this)
        this.getMachineById = this.getMachineById.bind(this)
        this.getMachineByControllerId = this.getMachineByControllerId.bind(this)
        this.getAllMachinesOfUser = this.getAllMachinesOfUser.bind(this)
        this.createMachineGroup = this.createMachineGroup.bind(this)
        this.getMachineGroupById = this.getMachineGroupById.bind(this)
        this.getAllMachineGroupsOfUser = this.getAllMachineGroupsOfUser.bind(this)
        this.createMachineType = this.createMachineType.bind(this)
        this.getMachineTypeById = this.getMachineTypeById.bind(this)
        this.getAllMachineTypes = this.getAllMachineTypes.bind(this)
    }

    async createMachine(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_MACHINE)) {
            throw new NotAuthorized()
        }

        const {number, name, place, groupId, typeId, equipmentId} = input

        const machine = new Machine()

        machine.number = number
        machine.name = name
        machine.place = place
        machine.user_id = user.id

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

        const savedMachine = await this.Machine.create(machine)

        const itemMatrix = await this.itemMatrixService.createItemMatrix(machine.id, user)

        savedMachine.item_matrix_id = itemMatrix.id

        return savedMachine.save()
    }

    async editMachine(input, user) {
        if (!user || !user.checkPermission(Permission.EDIT_MACHINE)) {
            throw new NotAuthorized()
        }

        const {machineId, controllerId, number, name, place, groupId, typeId} = input

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
        }

        if (groupId) {
            const machineGroup = await this.getMachineGroupById(groupId, user)

            if (!machineGroup) {
                throw new MachineGroupNotFound()
            }

            machine.machine_group_id = machineGroup.id
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

        return await machine.save()
    }

    async getAllMachinesOfUser(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_SELF_MACHINES)) {
            throw new NotAuthorized()
        }

        return await this.Machine.findAll({
            where: {
                user_id: user.id
            }
        })
    }

    async getMachineById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_SELF_MACHINES)) {
            throw new NotAuthorized()
        }

        return await this.Machine.findOne({
            where: {
                id: id,
                user_id: user.id
            }
        })
    }


    async getMachineByControllerId(controllerId, user) {
        if (!user || !user.checkPermission(Permission.GET_MACHINE_BY_CONTROLLER_ID)) {
            throw new NotAuthorized()
        }

        return await this.Machine.findOne({
            where: {
                controller_id: controllerId,
                user_id: user.id
            }
        })
    }

    async createMachineGroup(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_MACHINE_GROUP)) {
            throw new NotAuthorized()
        }

        const {name} = input

        const machineGroup = new MachineGroup()

        machineGroup.name = name
        machineGroup.user_id = user.id

        return await this.MachineGroup.create(machineGroup)
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
}

module.exports = MachineService
