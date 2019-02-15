const NotAuthorized = require("../errors/NotAuthorized")
const Controller = require("../models/Controller")
const ControllerState = require("../models/ControllerState")
const ControllerError = require("../models/ControllerError")
const Permission = require("../enum/Permission")
const crypto = require("crypto")

class ControllerService {

    constructor({EquipmentModel, ItemMatrixModel, ButtonItemModel, ControllerModel, ControllerErrorModel, ControllerStateModel, equipmentService, fiscalRegistrarService, bankTerminalService, itemMatrixService, buttonItemService}) {

        this.Controller = ControllerModel
        this.ControllerState = ControllerStateModel
        this.ControllerError = ControllerErrorModel
        this.Equipment = EquipmentModel
        this.ButtonItem = ButtonItemModel
        this.ItemMatrix = ItemMatrixModel
        this.equipmentService = equipmentService
        this.fiscalRegistrarService = fiscalRegistrarService
        this.bankTerminalService = bankTerminalService
        this.itemMatrixService = itemMatrixService
        this.buttonItemService = buttonItemService

        this.createController = this.createController.bind(this)
        this.editController = this.editController.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getControllerByUID = this.getControllerByUID.bind(this)
        this.getControllerById = this.getControllerById.bind(this)
        this.addErrorToController = this.addErrorToController.bind(this)
    }

    async createController(input, user) {
        if (!user || !user.checkPermission(Permission.WRITE_CONTROLLER)) {
            throw new NotAuthorized()
        }
        const {name, uid, revision, status, mode, equipmentId, fiscalRegistrarId, bankTerminalId} = input


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


        controller.name = name
        controller.uid = uid
        controller.revision = revision
        controller.status = status
        controller.mode = mode
        controller.user = user

        controller.equipment_id = equipment.id


        const savedController = await this.Controller.create(controller, {})

        await this.itemMatrixService.createItemMatrix({buttons: []}, savedController, user)

        const result = await this.Controller.find({
            include: [
                {
                    model: this.Equipment,
                    as: "equipment"
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
                }
            ],
            where: {
                id: savedController.id
            }
        })

        return result
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

        return await this.controllerRepository.save(controller)
    }

    async getAll(user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.controllerRepository.find()
    }

    async getControllerById(id, user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }


        const controller = await this.controllerRepository.findOne({id})
        const {itemMatrix} = controller

        if (controller) {
            itemMatrix.buttons = await this.buttonItemService.getButtonItemsByItemMatrix(itemMatrix, user)
        }

        return controller
    }


    async getControllerByUID(uid, user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const controller = await this.controllerRepository.findOne({uid})
        const {itemMatrix} = controller

        if (controller) {
            itemMatrix.buttons = await this.buttonItemService.getButtonItemsByItemMatrix(itemMatrix, user)
        }

        return controller
    }


    async addErrorToController(uid, message, user) {
        if (!user || !user.checkPermission(Permission.WRITE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const controller = await this.getControllerByUID(uid, user)

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
        controllerError.controller = controller

        return await this.controllerErrorRepository.save(controllerError)
    }

    async generateAccessKey(uid, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        let controller = await this.controllerRepository.findOne({uid: uid})

        if (!controller) {
            return null
        }

        controller.accessKey = await this._generateRandomAccessKey()

        return await this.controllerRepository.save(controller)
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
        controllerState.controller = controller

        controllerState = await this.controllerStateRepository.save(controllerState)

        controller.lastState = controllerState

        return await this.controllerRepository.save(controller)
    }


    async _generateRandomAccessKey() {
        return new Promise((res, rej) => {
            const buf = Buffer.alloc(16)
            crypto.randomFill(buf, 0, 16, (err, buf) => {
                if (err) {
                    return rej(err)
                }

                res(buf.toString("hex"))
            })
        })

    }

}

module.exports = ControllerService
