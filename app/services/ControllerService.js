const NotAuthorized = require("../errors/NotAuthorized")
const Controller = require("../models/Controller")
const ControllerError = require("../models/ControllerError")
const Permission = require("../enum/Permission")

const crypto = require("crypto")

class ControllerService {

    constructor({controllerErrorRepository, controllerRepository, equipmentService, fiscalRegistrarService, bankTerminalService}) {
        this.controllerRepository = controllerRepository
        this.controllerErrorRepository = controllerErrorRepository
        this.equipmentService = equipmentService
        this.fiscalRegistrarService = fiscalRegistrarService
        this.bankTerminalService = bankTerminalService

        this.createController = this.createController.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getControllerByUID = this.getControllerByUID.bind(this)
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

        const fiscalRegistrar = await this.fiscalRegistrarService.findById(fiscalRegistrarId, user)

        if (!fiscalRegistrar) {
            throw new Error("Fiscal registrar not found")
        }

        const bankTerminal = await this.bankTerminalService.findById(bankTerminalId, user)

        if (!bankTerminal) {
            throw new Error("Bank terminal not found")
        }

        const controller = new Controller()
        controller.name = name
        controller.uid = uid
        controller.equipment = equipment
        controller.revision = revision
        controller.status = status
        controller.mode = mode
        controller.fiscalRegistrar = fiscalRegistrar
        controller.bankTerminal = bankTerminal
        controller.user = user

        return await this.controllerRepository.save(controller)
    }

    async getAll(user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        return await this.controllerRepository.find()
    }

    async getControllerByUID(uid, user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized()
        }

        //todo validation UID

        return await this.controllerRepository.findOne({uid: uid})
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

        controller = await this.controllerRepository.save(controller)

        return controller.accessKey

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
