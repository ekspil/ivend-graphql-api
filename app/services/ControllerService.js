const NotAuthorized = require("../errors/NotAuthorized")
const Controller = require("../models/Controller")
const ControllerState = require("../models/ControllerState")
const ControllerError = require("../models/ControllerError")
const Permission = require("../enum/Permission")
const hashingUtils = require("../utils/hashingUtils")

class ControllerService {

    constructor({EquipmentModel, ItemMatrixModel, ButtonItemModel, ControllerModel, ControllerErrorModel, ControllerStateModel, UserModel, equipmentService, fiscalRegistrarService, bankTerminalService, itemMatrixService, buttonItemService, serviceService}) {

        this.Controller = ControllerModel
        this.ControllerState = ControllerStateModel
        this.ControllerError = ControllerErrorModel
        this.Equipment = EquipmentModel
        this.ButtonItem = ButtonItemModel
        this.ItemMatrix = ItemMatrixModel
        this.User = UserModel
        this.serviceService = serviceService
        this.equipmentService = equipmentService
        this.fiscalRegistrarService = fiscalRegistrarService
        this.bankTerminalService = bankTerminalService
        this.itemMatrixService = itemMatrixService
        this.buttonItemService = buttonItemService

        this.createController = this.createController.bind(this)
        this.editController = this.editController.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getAllOfCurrentUser = this.getAllOfCurrentUser.bind(this)
        this.getControllerByUID = this.getControllerByUID.bind(this)
        this.getControllerById = this.getControllerById.bind(this)
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
        if (!user || !user.checkPermission(Permission.WRITE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, uid, revision, status, mode, equipmentId, fiscalRegistrarId, bankTerminalId, serviceIds} = input


        const equipment = await this.equipmentService.findById(equipmentId, user)

        if (!equipment) {
            throw new Error("Equipment not found")
        }

        const controller = new Controller()

        if (fiscalRegistrarId) {
            const fiscalRegistrar = await this.fiscalRegistrarService.findById(fiscalRegistrarId, user)

            if (fiscalRegistrar) {
                throw new Error("Fiscal registrar not found")
            }

            controller.fiscalRegistrar = fiscalRegistrar
        }


        if (bankTerminalId) {
            const bankTerminal = await this.bankTerminalService.findById(bankTerminalId, user)

            if (bankTerminal) {
                throw new Error("Bank terminal not found")
            }

            controller.bankTerminal = bankTerminal
        }

        if (serviceIds) {
            const services = await Promise.all(serviceIds.map(async serviceId => {
                const service = await this.serviceService.findById(serviceId, user)

                if (!service) {
                    throw new Error(`Service with id ${serviceId} not found`)
                }

                return service
            }))

            await this.serviceService.addServicesToUser(services, user)
        }

        controller.name = name
        controller.uid = uid
        controller.revision = revision
        controller.status = status
        controller.mode = mode
        controller.user_id = user.id

        controller.equipment_id = equipment.id


        const savedController = await this.Controller.create(controller, {})

        await this.itemMatrixService.createItemMatrix({buttons: []}, savedController, user)

        return await this.Controller.find({
            include: this.controllerIncludes,
            where: {
                id: savedController.id
            }
        })
    }

    async editController(id, input, user) {
        if (!user || !user.checkPermission(Permission.WRITE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, equipmentId, revision, status, mode, fiscalRegistrarId, bankTerminalId} = input

        const controller = await this.getControllerById(id, user)

        if (!controller) {
            throw new Error("Controller not found")
        }

        if (equipmentId) {
            const equipment = await this.equipmentService.findById(equipmentId, user)

            if (!equipment) {
                throw new Error("Equipment not found")
            }

            controller.equipment = equipment
        }

        if (fiscalRegistrarId) {
            const fiscalRegistrar = await this.fiscalRegistrarService.findById(fiscalRegistrarId, user)

            if (!fiscalRegistrar) {
                throw new Error("Fiscal registrar not found")
            }

            controller.fiscalRegistrar = fiscalRegistrar
        }


        if (bankTerminalId) {
            const bankTerminal = await this.bankTerminalService.findById(bankTerminalId, user)

            if (!bankTerminal) {
                throw new Error("Bank terminal not found")
            }

            controller.bankTerminal = bankTerminal
        }


        if (name) {
            controller.name = name
        }

        if (revision) {
            controller.revision = revision
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
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.Controller.findAll({include: this.controllerIncludes})
    }

    async getAllOfCurrentUser(user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.Controller.findAll({include: this.controllerIncludes, where: {user_id: user.id}})
    }

    async getControllerById(id, user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const controller = await this.Controller.findById(id, {include: this.controllerIncludes})

        if (!controller) {
            return null
        }

        return controller
    }


    async getControllerByUID(uid, user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const controller = await this.Controller.findOne({
            where: {
                uid
            },
            include: this.controllerIncludes
        })

        if (!controller) {
            return null
        }

        return controller
    }


    async registerError(input, user) {
        if (!user || !user.checkPermission(Permission.WRITE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {controllerUid, message} = input

        const controller = await this.getControllerByUID(controllerUid, user)

        if (!controller) {
            //todo custom error
            throw new Error("Controller not found")
        }

        //check controller belongs to user
        if (!user.id === controller.user.id) {
            throw new NotAuthorized()
        }

        const controllerError = new ControllerError()
        controllerError.message = message
        controllerError.controller_id = controller.id

        await this.ControllerError.create(controllerError)

        return await this.getControllerById(controller.id, user)
    }

    async generateAccessKey(uid, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
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
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        //todo start transaction

        const {
            controllerUid,
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
            throw new Error("Controller not found")
        }

        let controllerState = new ControllerState()
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
