const NotAuthorized = require("../errors/NotAuthorized")
const BusStatus = require("../enum/BusStatus")
const ControllerUIDConflict = require("../errors/ControllerUIDConflict")
const RevisionNotFound = require("../errors/RevisionNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const Controller = require("../models/Controller")
const ControllerState = require("../models/ControllerState")
const ControllerError = require("../models/ControllerError")
const Permission = require("../enum/Permission")
const hashingUtils = require("../utils/hashingUtils")
const logger = require("../utils/logger")

class ControllerService {

    constructor({ItemModel, ControllerModel, ControllerErrorModel, ControllerStateModel, UserModel, RevisionModel, revisionService, machineService}) {
        this.Controller = ControllerModel
        this.ControllerState = ControllerStateModel
        this.ControllerError = ControllerErrorModel
        this.Item = ItemModel
        this.User = UserModel
        this.Revision = RevisionModel
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
        this.authController = this.authController.bind(this)
    }

    async createController(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, uid, revisionId, status, mode, readStatMode, bankTerminalMode, fiscalizationMode} = input

        let controller = await this.getControllerByUID(uid, user)

        if (controller) {
            throw new ControllerUIDConflict()
        }

        controller = new Controller()

        const revision = await this.revisionService.getRevisionById(revisionId, user)

        if (!revision) {
            throw new RevisionNotFound()
        }

        controller.revision_id = revision.id

        controller.name = name
        controller.uid = uid
        controller.revision = revision
        controller.status = status
        controller.mode = mode
        controller.readStatMode = readStatMode
        controller.bankTerminalMode = bankTerminalMode
        controller.fiscalizationMode = fiscalizationMode
        controller.connected = false

        controller.user_id = user.id

        const savedController = await this.Controller.create(controller)

        return await this.Controller.find({
            where: {
                id: savedController.id
            }
        })
    }

    async editController(id, input, user) {
        if (!user || !user.checkPermission(Permission.EDIT_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, revisionId, status, mode, readStatMode, bankTerminalMode, fiscalizationMode} = input

        const controller = await this.getControllerById(id, user)

        if (!controller) {
            throw new ControllerNotFound()
        }

        if (revisionId) {
            const revision = await this.revisionService.getRevisionById(revisionId, user)

            if (!revision) {
                throw new RevisionNotFound()
            }

            controller.revision_id = revision.id
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

        if (readStatMode) {
            controller.readStatMode = readStatMode
        }

        if (bankTerminalMode) {
            controller.bankTerminalMode = bankTerminalMode
        }

        if (fiscalizationMode) {
            controller.fiscalizationMode = fiscalizationMode
        }

        await controller.save()

        return this.getControllerById(id, user)
    }

    async getAll(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }

        return await this.Controller.findAll()
    }

    async getAllOfCurrentUser(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }

        return await this.Controller.findAll({where: {user_id: user.id}})
    }

    async getControllerById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_BY_ID)) {
            throw new NotAuthorized()
        }

        const options = {
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


    async registerState(controllerStateInput, user) {
        if (!user || !user.checkPermission(Permission.REGISTER_CONTROLLER_STATE)) {
            throw new NotAuthorized()
        }

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

        const machine = await controller.getMachine()

        if (!machine) {
            throw new Error("Machine not found")
        }

        const machineUser = await machine.getUser()

        const lastState = await controller.getLastState()

        return this.Controller.sequelize.transaction(async (transaction) => {
            if (!lastState) {
                await this.machineService.addLog(machine.id, `Контроллер подключён`, user, transaction)
            }

            let controllerState = new ControllerState()
            controllerState.firmwareId = firmwareId

            await this._registerMachineLogs("coinAcceptorStatus", billAcceptorStatus, "Монетоприёмник", machine.id, lastState, machineUser, transaction)
            controllerState.coinAcceptorStatus = coinAcceptorStatus

            await this._registerMachineLogs("billAcceptorStatus", billAcceptorStatus, "Купюроприёмник", machine.id, lastState, machineUser, transaction)
            controllerState.billAcceptorStatus = billAcceptorStatus

            controllerState.coinAmount = coinAmount
            controllerState.billAmount = billAmount

            await this._registerMachineLogs("dex1Status", dex1Status, "DEX1", machine.id, lastState, machineUser, transaction)
            controllerState.dex1Status = dex1Status

            await this._registerMachineLogs("dex2Status", dex2Status, "DEX2", machine.id, lastState, machineUser, transaction)
            controllerState.dex2Status = dex2Status

            await this._registerMachineLogs("exeStatus", exeStatus, "EXE", machine.id, lastState, machineUser, transaction)
            controllerState.exeStatus = exeStatus

            await this._registerMachineLogs("mdbStatus", mdbStatus, "MDB", machine.id, lastState, machineUser, transaction)
            controllerState.mdbStatus = mdbStatus

            controllerState.signalStrength = signalStrength
            controllerState.registrationTime = new Date()
            controllerState.controller_id = controller.id

            controllerState = await this.ControllerState.create(controllerState, {transaction})

            controller.last_state_id = controllerState.id

            return await controller.save({transaction})
        })
    }

    async _registerMachineLogs(busKey, busValue, busName, machineId, lastState, user, transaction) {
        let message

        if (busValue === BusStatus.OK) {
            if (lastState[busKey] === BusStatus.ERROR) {
                if (busKey === "coinAcceptorStatus" || busKey === "billAcceptorStatus") {
                    message = `${busName} работает`
                } else {
                    message = `Ошибка ${busName} разрешена`
                }
            }
        } else if (busValue === BusStatus.ERROR) {
            if (lastState[busKey] === BusStatus.OK) {
                if (busKey === "coinAcceptorStatus" || busKey === "billAcceptorStatus") {
                    message = `${busName} работает`
                } else {
                    message = `Ошибка ${busName} разрешена`
                }
            }
        }

        await this.machineService.addLog(machineId, message, user, transaction)
    }


    async authController(input, user) {
        if (!user || !user.checkPermission(Permission.REGISTER_CONTROLLER_STATE)) {
            throw new NotAuthorized()
        }

        const {controllerUid, firmwareId} = input

        const controller = await this.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new ControllerNotFound()
        }

        controller.registrationTime = new Date()
        controller.firmwareId = firmwareId
        controller.accessKey = await hashingUtils.generateRandomAccessKey(4)

        await controller.save()

        return await this.getControllerById(controller.id, user)
    }

}

module.exports = ControllerService
