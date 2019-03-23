const NotAuthorized = require("../errors/NotAuthorized")
const FiscalRegistrarNotFound = require("../errors/FiscalRegistrarNotFound")
const RevisionNotFound = require("../errors/RevisionNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const MachineNotFound = require("../errors/MachineNotFound")
const ServiceNotFound = require("../errors/ServiceNotFound")
const BankTerminalNotFound = require("../errors/BankTerminalNotFound")
const EquipmentNotFound = require("../errors/EquipmentNotFound")
const Controller = require("../models/Controller")
const ControllerState = require("../models/ControllerState")
const ControllerError = require("../models/ControllerError")
const Permission = require("../enum/Permission")
const hashingUtils = require("../utils/hashingUtils")

class ControllerService {

    constructor({EquipmentModel, ItemMatrixModel, ButtonItemModel, ControllerModel, ControllerErrorModel, ControllerStateModel, UserModel, RevisionModel, equipmentService, fiscalRegistrarService, bankTerminalService, itemMatrixService, buttonItemService, serviceService, revisionService, machineService}) {

        this.Controller = ControllerModel
        this.ControllerState = ControllerStateModel
        this.ControllerError = ControllerErrorModel
        this.Equipment = EquipmentModel
        this.ButtonItem = ButtonItemModel
        this.ItemMatrix = ItemMatrixModel
        this.User = UserModel
        this.Revision = RevisionModel
        this.serviceService = serviceService
        this.equipmentService = equipmentService
        this.fiscalRegistrarService = fiscalRegistrarService
        this.bankTerminalService = bankTerminalService
        this.itemMatrixService = itemMatrixService
        this.buttonItemService = buttonItemService
        this.serviceService = serviceService
        this.revisionService = revisionService
        this.machineService = machineService

        this.createController = this.createController.bind(this)
        this.editController = this.editController.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getAllOfCurrentUser = this.getAllOfCurrentUser.bind(this)
        this.getControllerByUID = this.getControllerByUID.bind(this)
        this.getControllerById = this.getControllerById.bind(this)
        this.getControllerErrors = this.getControllerErrors.bind(this)
        this.getLastControllerError = this.getLastControllerError.bind(this)
        this.registerError = this.registerError.bind(this)
        this.registerState = this.registerState.bind(this)

        this.controllerIncludes = [
            {
                model: this.Equipment,
                as: "equipment"
            },
            {
                model: this.ControllerState,
                as: "lastState"
            },
            {
                model: this.Revision,
                as: "revision"
            },
            {
                model: this.ItemMatrix,
                as: "itemMatrix",
                include: [
                    {
                        model: this.ButtonItem,
                        as: "buttons"
                    }
                ]
            },
            {
                model: this.User,
                as: "user",
            }
        ]
    }

    async createController(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, uid, revisionId, status, mode, equipmentId, fiscalRegistrarId, bankTerminalId, serviceIds, machineId} = input

        const controller = new Controller()

        const machine = await this.machineService.getMachineById(machineId, user)

        if (!machine) {
            throw new MachineNotFound()
        }

        controller.machine_id = machine.id

        const revision = await this.revisionService.getRevisionById(revisionId, user)

        if (!revision) {
            throw new RevisionNotFound()
        }

        controller.revision_id = revision.id

        const equipment = await this.equipmentService.findById(equipmentId, user)

        if (!equipment) {
            throw new EquipmentNotFound()
        }

        controller.equipment_id = equipment.id

        if (fiscalRegistrarId) {
            const fiscalRegistrar = await this.fiscalRegistrarService.findById(fiscalRegistrarId, user)

            if (fiscalRegistrar) {
                throw new FiscalRegistrarNotFound()
            }

            controller.fiscal_registrar_id = fiscalRegistrar.id
        }


        if (bankTerminalId) {
            const bankTerminal = await this.bankTerminalService.findById(bankTerminalId, user)

            if (bankTerminal) {
                throw new BankTerminalNotFound()
            }

            controller.bank_terminal_id = bankTerminal.id
        }

        controller.name = name
        controller.uid = uid
        controller.revision = revision
        controller.status = status
        controller.mode = mode

        controller.user_id = user.id

        const savedController = await this.Controller.create(controller)

        await this.itemMatrixService.createItemMatrix(savedController.id, user)

        if (serviceIds) {
            await Promise.all(serviceIds.map(async serviceId => {
                const service = await this.serviceService.findById(serviceId, user)

                if (!service) {
                    throw new ServiceNotFound()
                }

                await savedController.addService(service)
            }))

        }

        return await this.Controller.find({
            include: this.controllerIncludes,
            where: {
                id: savedController.id
            }
        })
    }

    async editController(id, input, user) {
        if (!user || !user.checkPermission(Permission.EDIT_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, equipmentId, revisionId, status, mode, fiscalRegistrarId, bankTerminalId} = input

        const controller = await this.getControllerById(id, user)

        if (!controller) {
            throw new ControllerNotFound()
        }

        if (equipmentId) {
            const equipment = await this.equipmentService.findById(equipmentId, user)

            if (!equipment) {
                throw new EquipmentNotFound()
            }

            controller.equipment_id = equipment.id
        }

        if (revisionId) {
            const revision = await this.revisionService.getRevisionById(revisionId, user)

            if (!revision) {
                throw new RevisionNotFound()
            }

            controller.revision_id = revision.id
        }

        if (fiscalRegistrarId) {
            const fiscalRegistrar = await this.fiscalRegistrarService.findById(fiscalRegistrarId, user)

            if (!fiscalRegistrar) {
                throw FiscalRegistrarNotFound
            }

            controller.fiscal_registrar_id = fiscalRegistrar.id
        }


        if (bankTerminalId) {
            const bankTerminal = await this.bankTerminalService.findById(bankTerminalId, user)

            if (!bankTerminal) {
                throw new BankTerminalNotFound()
            }

            controller.bank_terminal_id = bankTerminal.id
        }


        if (name) {
            controller.name = name
        }

        if (status) {
            controller.status = status
        }

        if (mode) {
            controller.mode = mode
        }

        await controller.save()

        return this.getControllerById(id, user)
    }

    async getAll(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }

        return await this.Controller.findAll({include: this.controllerIncludes})
    }

    async getAllOfCurrentUser(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }

        return await this.Controller.findAll({include: this.controllerIncludes, where: {user_id: user.id}})
    }

    async getControllerById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_BY_ID)) {
            throw new NotAuthorized()
        }

        const options = {
            include: this.controllerIncludes,
            where: {}
        }

        if (user.role !== "ADMIN") {
            options.where.user_id = user.id
        }

        const controller = await this.Controller.findById(id, options)

        if (!controller) {
            logger.info(`Controller{${id}} not found for User{${user.id}}`)
            return null
        }

        return controller
    }


    async getControllerByUID(uid, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_BY_UID)) {
            throw new NotAuthorized()
        }

        const options = {
            include: this.controllerIncludes,
            where: {
                uid
            }
        }

        if (!["ADMIN", "AGGREGATE"].some(role => user.role === role)) {
            options.where.user_id = user.id
        }

        const controller = await this.Controller.findOne(options)

        if (!controller) {
            return null
        }

        return controller
    }

    async getControllerErrors(id, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_ERRORS)) {
            throw new NotAuthorized()
        }

        return await this.ControllerError.findAll({
            where: {
                controller_id: id
            }
        })
    }


    async getLastControllerError(id, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_ERRORS)) {
            throw new NotAuthorized()
        }

        return await this.ControllerError.findOne({
            where: {
                controller_id: id
            },
            order: [
                ["id", "DESC"],
            ]
        })
    }


    async registerError(input, user) {
        if (!user || !user.checkPermission(Permission.REGISTER_CONTROLLER_ERROR)) {
            throw new NotAuthorized()
        }

        const {controllerUid, errorTime, message} = input

        const controller = await this.getControllerByUID(controllerUid, user)

        if (!controller) {
            //todo custom error
            throw new ControllerNotFound()
        }

        //check controller belongs to user
        if (!user.id === controller.user.id) {
            throw new NotAuthorized()
        }

        const controllerError = new ControllerError()
        controllerError.message = message
        controllerError.controller_id = controller.id
        controllerError.errorTime = errorTime

        return await this.ControllerError.create(controllerError)
    }

    async generateAccessKey(uid, user) {
        if (!user || !user.checkPermission(Permission.GENERATE_CONTROLLER_ACCESS_KEY)) {
            throw new NotAuthorized()
        }

        const controller = await this.getControllerByUID(uid, user)

        if (!controller) {
            return null
        }

        controller.accessKey = await hashingUtils.generateRandomAccessKey()

        await controller.save()

        return await this.getControllerById(controller.id, user)
    }

    async registerState(controllerStateInput, user) {
        if (!user || !user.checkPermission(Permission.REGISTER_CONTROLLER_STATE)) {
            throw new NotAuthorized()
        }

        //todo start transaction

        const {
            controllerUid,
            firmwareId,
            coinAcceptorStatus,
            billAcceptorStatus,
            coinAmount,
            billAmount,
            dex1Status,
            dex2Status,
            exeStatus,
            mdbStatus,
            signalStrength
        } = controllerStateInput

        const controller = await this.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new ControllerNotFound()
        }

        let controllerState = new ControllerState()
        controllerState.firmwareId = firmwareId
        controllerState.coinAcceptorStatus = coinAcceptorStatus
        controllerState.billAcceptorStatus = billAcceptorStatus
        controllerState.coinAmount = coinAmount
        controllerState.billAmount = billAmount
        controllerState.dex1Status = dex1Status
        controllerState.dex2Status = dex2Status
        controllerState.exeStatus = exeStatus
        controllerState.mdbStatus = mdbStatus
        controllerState.signalStrength = signalStrength
        controllerState.registrationTime = new Date()
        controllerState.controller_id = controller.id

        controllerState = await this.ControllerState.create(controllerState)

        controller.last_state_id = controllerState.id

        await controller.save()

        return await this.getControllerById(controller.id, user)
    }


}

module.exports = ControllerService
