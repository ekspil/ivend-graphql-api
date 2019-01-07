const NotAuthorized = require("../errors/NotAuthorized")
const Controller = require("../models/Controller")
const ControllerError = require("../models/ControllerError")
const Permission = require("../enum/Permission")

class ControllerService {

    constructor({controllerErrorRepository, controllerRepository}) {
        this.controllerRepository = controllerRepository
        this.controllerErrorRepository = controllerErrorRepository

        this.createController = this.createController.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getControllerByUID = this.getControllerByUID.bind(this)
    }

    async createController(uid, mode, user) {
        if (!uid || !mode) {
            throw new Error("UID and mode are required for controller creation")
        }

        if (!user || !user.checkPermission(Permission.WRITE_CONTROLLER)) {
            throw new NotAuthorized();
        }

        //todo validation uid
        //todo validation mode
        const controller = new Controller()
        controller.uid = uid
        controller.mode = mode
        controller.user = user

        return await this.controllerRepository.save(controller)
    }

    async getAll(user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized();
        }

        return await this.controllerRepository.find()
    }

    async getControllerByUID(uid, user) {
        if (!user || !user.checkPermission(Permission.READ_CONTROLLER)) {
            throw new NotAuthorized();
        }

        //todo validation UID

        return await this.controllerRepository.findOne({uid: uid})
    }

    async addErrorToController(uid, message, user) {
        if (!user || !user.checkPermission(Permission.WRITE_CONTROLLER)) {
            throw new NotAuthorized();
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

}

module.exports = ControllerService
