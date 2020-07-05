const NotAuthorized = require("../errors/NotAuthorized")
const BusStatus = require("../enum/BusStatus")
const ControllerUIDConflict = require("../errors/ControllerUIDConflict")
const RevisionNotFound = require("../errors/RevisionNotFound")
const ControllerNotFound = require("../errors/ControllerNotFound")
const MachineNotFound = require("../errors/MachineNotFound")
const Controller = require("../models/Controller")
const ControllerState = require("../models/ControllerState")
const ControllerError = require("../models/ControllerError")
const Permission = require("../enum/Permission")
const hashingUtils = require("../utils/hashingUtils")
const logger = require("my-custom-logger")
const MachineLogType = require("../enum/MachineLogType")
const {Op} = require("sequelize")

class ControllerService {

    constructor({EncashmentModel, ItemModel, ControllerModel, ControllerErrorModel, ControllerStateModel, UserModel, RevisionModel, revisionService, machineService, kktService, redis}) {
        this.Controller = ControllerModel
        this.ControllerState = ControllerStateModel
        this.ControllerError = ControllerErrorModel
        this.Item = ItemModel
        this.redis = redis
        this.User = UserModel
        this.Revision = RevisionModel
        this.Encashment = EncashmentModel
        this.revisionService = revisionService
        this.machineService = machineService
        this.kktService = kktService

        this.createController = this.createController.bind(this)
        this.editController = this.editController.bind(this)
        this.deleteController = this.deleteController.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getAllOfCurrentUser = this.getAllOfCurrentUser.bind(this)
        this.getControllerByUID = this.getControllerByUID.bind(this)
        this.getControllerById = this.getControllerById.bind(this)
        this.getControllerErrors = this.getControllerErrors.bind(this)
        this.getLastControllerError = this.getLastControllerError.bind(this)
        this.registerError = this.registerError.bind(this)
        this.registerState = this.registerState.bind(this)
        this.authController = this.authController.bind(this)
        this.registerEvent = this.registerEvent.bind(this)
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

        const {name, revisionId, status, mode, readStatMode, bankTerminalMode, fiscalizationMode, remotePrinterId, simCardNumber} = input

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

        if (remotePrinterId) {
            controller.remotePrinterId = remotePrinterId
        }

        if (simCardNumber) {
            controller.simCardNumber = simCardNumber
        }
        else if(simCardNumber === "false" || simCardNumber === "0" ){
            controller.simCardNumber = null
        }

        await controller.save()

        return this.getControllerById(id, user)
    }


    async deleteController(id, user) {
        if (!user || !user.checkPermission(Permission.DELETE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const controller = await this.getControllerById(id, user)

        if (!controller) {
            throw new ControllerNotFound()
        }

        const machine = await this.machineService.getMachineByControllerId(controller.id, user)

        if (machine) {
            machine.controller_id = null

            await machine.save()
        }

        await controller.destroy()
    }


    async getAll(offset, limit, status, connection, terminal, fiscalizationMode, bankTerminalMode, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }

        const where = {}
        if (!limit) {
            limit = 50
        }
        if (bankTerminalMode && bankTerminalMode !== "ALL") {
            if(terminal === "ENABLED"){
                bankTerminalMode.bankTerminalMode = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["NO_BANK_TERMINAL"]
                    }
                }
            }
            if(bankTerminalMode === "DISABLED"){
                where.bankTerminalMode = {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.in]: ["NO_BANK_TERMINAL"]
                    }
                }
            }
        }
        if (terminal) {
            if(terminal === "ENABLED"){
                where.simCardNumber = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["false", "FALSE", "0"]
                    }
                }
            }
            if(terminal === "DISABLED"){
                where.simCardNumber = {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.in]: ["false", "FALSE", "0"]
                    }
                }
            }

        }
        if (fiscalizationMode && fiscalizationMode !== "ALL") {
            if(fiscalizationMode === "ENABLED"){
                where.fiscalizationMode = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["NO_FISCAL"]
                    }
                }
            }
            if(fiscalizationMode === "DISABLED"){
                where.fiscalizationMode = {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.in]: ["NO_FISCAL"]
                    }
                }
            }
        }

        if (status && status !== "ALL") {
            where.status = status
        }
        if (connection && connection !== "ALL") {

            if(connection === "OK"){
                const to = new Date().getTime()
                const from = new Date().getTime() - (1000 * 60 * 15)
                where.registrationTime = {
                    [Op.lt]: to,
                    [Op.gt]: from
                }
            }
            if(connection === "WARNING"){
                const to = new Date().getTime() - (1000 * 60 * 15)
                const from = new Date().getTime() - (1000 * 60 * 30)
                where.registrationTime = {
                    [Op.lt]: to,
                    [Op.gt]: from
                }
            }
            if(connection === "ALERT"){

                const to = new Date().getTime() - (1000 * 60 * 30)
                const from = new Date().getTime() - (1000 * 60 * 60 * 24)
                where.registrationTime = {
                    [Op.lt]: to,
                    [Op.gt]: from
                }
            }
            if(connection === "NO"){
                const to = new Date().getTime() - (1000 * 60 * 60 * 24)
                const from = new Date().getTime() - (1000 * 60 * 60 * 24 * 365 * 10)
                where.registrationTime = {
                    [Op.or]:
                        [
                            {
                                [Op.lt]: to,
                                [Op.gt]: from
                            },
                            {
                                [Op.is]: null
                            }

                        ]

                }
            }

        }


        return await this.Controller.findAll({
            offset,
            limit,
            where,
            order: [
                ["id", "DESC"],
            ]
        })
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

    async getControllerServices(id, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }
        const services = []
        const controller = await this.getControllerById(id, user)
        const allUserControllers = await this.getAllOfCurrentUser(user)
        const kkts = await this.kktService.getUserKkts(user)
        const kktOk = kkts.filter(kkt => kkt.kktActivationDate)
        const fiscalControllers = allUserControllers.filter(controller => controller.fiscalizationMode !== "NO_FISCAL")
        if(controller && controller.status === "ENABLED"){
            services.push({
                id: 1,
                name: "Услуги телеметрии",
                price: 100,
                billingType: null
            })
        }
        if(controller && controller.simCardNumber && controller.simCardNumber !== "0" && controller.simCardNumber !== "false" && controller.status === "ENABLED"){
            services.push({
                id: 10,
                name: "Услуги эквайринга",
                price: 100,
                billingType: null
            })
        }
        if(kktOk && allUserControllers &&  kktOk.length > 0){
            const price = fiscalControllers.length > (20 * kktOk.length) ? fiscalControllers.length * 100 : 2000 * kktOk.length
            services.push({
                id: 5,
                name: "Услуги фискализации",
                price,
                billingType: null,
                fixCount: 1
            })
        }
        return services



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

        const machine = await this.machineService.getMachineByControllerId(controller.id, user)

        if (!machine) {
            throw new Error("Machine not found")
        }

        const machineUser = await machine.getUser()
        machineUser.checkPermission = () => true

        const lastState = await controller.getLastState()

        return this.Controller.sequelize.transaction(async (transaction) => {
            if (!lastState) {
                await this.machineService.addLog(machine.id, `Контроллер подключён`, MachineLogType.REGISTRATION, machineUser, transaction)
            }

            let controllerState = new ControllerState()
            controllerState.firmwareId = firmwareId

            await this._registerMachineLogs("coinAcceptorStatus", coinAcceptorStatus, "Монетоприёмник", MachineLogType.COINACCEPTOR, machine.id, lastState, machineUser, transaction)
            controllerState.coinAcceptorStatus = coinAcceptorStatus

            await this._registerMachineLogs("billAcceptorStatus", billAcceptorStatus, "Купюроприёмник", MachineLogType.BILLACCEPTOR, machine.id, lastState, machineUser, transaction)
            controllerState.billAcceptorStatus = billAcceptorStatus

            controllerState.coinAmount = coinAmount
            controllerState.billAmount = billAmount

            await this._registerMachineLogs("dex1Status", dex1Status, "DEX1", MachineLogType.BUS_ERROR, machine.id, lastState, machineUser, transaction)
            controllerState.dex1Status = dex1Status

            await this._registerMachineLogs("dex2Status", dex2Status, "DEX2", MachineLogType.BUS_ERROR, machine.id, lastState, machineUser, transaction)
            controllerState.dex2Status = dex2Status

            await this._registerMachineLogs("exeStatus", exeStatus, "EXE", MachineLogType.BUS_ERROR, machine.id, lastState, machineUser, transaction)
            controllerState.exeStatus = exeStatus

            await this._registerMachineLogs("mdbStatus", mdbStatus, "MDB", MachineLogType.BUS_ERROR, machine.id, lastState, machineUser, transaction)
            controllerState.mdbStatus = mdbStatus

            controllerState.signalStrength = signalStrength
            controllerState.registrationTime = new Date()
            controllerState.controller_id = controller.id

            const machineError = await this.redis.get("machine_error_" + machine.id)
            if(machineError !== "NO SALES 24H"){
                await this.redis.set("machine_error_" + machine.id, `OK`, "px", 24 * 60 * 60 * 1000)
            }


            controllerState = await this.ControllerState.create(controllerState, {transaction})

            if (lastState && !controller.connected) {
                //add log connection regain
                await this.machineService.addLog(machine.id, `Связь восстановлена`, MachineLogType.CONNECTION, machineUser, transaction)
            }

            controller.connected = true
            await controller.save({transaction})

            controller.last_state_id = controllerState.id

            return await controller.save({transaction})
        })
    }

    async _registerMachineLogs(busKey, busValue, busName, machineLogType, machineId, lastState, user, transaction) {
        if (!lastState) {
            return
        }

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
                    message = `Не работает ${busName.toLowerCase()}`
                } else {
                    message = `Ошибка ${busName}`
                }
            }
        }

        if (message) {
            await this.machineService.addLog(machineId, message, machineLogType, user, transaction)
        }

    }


    async authController(input, user) {
        if (!user || !user.checkPermission(Permission.REGISTER_CONTROLLER_STATE)) {
            throw new NotAuthorized()
        }

        const {controllerUid, firmwareId, imsi} = input

        const controller = await this.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new ControllerNotFound()
        }
        if(imsi){
            controller.imsi = imsi
        }
        controller.registrationTime = new Date()
        controller.firmwareId = firmwareId
        controller.accessKey = await hashingUtils.generateRandomAccessKey(4)

        await controller.save()

        return await this.getControllerById(controller.id, user)
    }

    async registerEvent(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER_EVENT)) {
            throw new NotAuthorized()
        }

        const {controllerUid, timestamp, eventType} = input

        if(eventType !== "ENCASHMENT") {
            throw new Error("Unknown event type")
        }

        const controller = await this.getControllerByUID(controllerUid, user)

        if (!controller) {
            throw new ControllerNotFound()
        }

        const controllerUser = await controller.getUser()
        controllerUser.checkPermission = () => true

        const machine = await this.machineService.getMachineByControllerId(controller.id, user)

        if (!machine) {
            throw new MachineNotFound()
        }

        await this.machineService.createEncashment(machine.id, timestamp, controllerUser)
        await this.redis.set("machine_encashment_" + machine.id, `${timestamp}`, "px", 31 * 24 * 60 * 60 * 1000)

        return await this.getControllerById(controller.id, user)
    }

}

module.exports = ControllerService
