const NotAuthorized = require("../errors/NotAuthorized")
const Controller = require("../models/Controller")
const Permission = require("../enum/Permission")

class ControllerService {

    constructor(controllerRepository) {
        this.controllerRepository = controllerRepository

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

}

module.exports = ControllerService
