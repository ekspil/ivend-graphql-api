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
const Commands = require("../enum/VendistaCommands")
const hashingUtils = require("../utils/hashingUtils")
const logger = require("my-custom-logger")
const MachineLogType = require("../enum/MachineLogType")
const microservices = require("../utils/microservices")
const {Op} = require("sequelize")

class ControllerService {

    constructor({EncashmentModel, ItemModel, ControllerModel, ControllerErrorModel, MachineModel, ControllerStateModel, ControllerIntegrationsModel, ControllerPulseModel, UserModel, RevisionModel, revisionService, machineService, kktService, redis, SaleModel, billingService}) {
        this.Controller = ControllerModel
        this.Sale = SaleModel
        this.ControllerState = ControllerStateModel
        this.ControllerIntegration = ControllerIntegrationsModel
        this.ControllerError = ControllerErrorModel
        this.Item = ItemModel
        this.Machine = MachineModel
        this.redis = redis
        this.User = UserModel
        this.Revision = RevisionModel
        this.Encashment = EncashmentModel
        this.revisionService = revisionService
        this.machineService = machineService
        this.billingService = billingService
        this.kktService = kktService
        this.ControllerPulse = ControllerPulseModel



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
        this.getControllerServices = this.getControllerServices.bind(this)
        this.setControllerPulse = this.setControllerPulse.bind(this)
        this.getVendistaId= this.getVendistaId.bind(this)
    }

    async createController(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, uid, revisionId, status, mode, readStatMode, bankTerminalMode, fiscalizationMode, bankTerminalUid} = input

        let controller = await this.Controller.findOne({
            where: {
                uid
            }
        })

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
        controller.bankTerminalUid = bankTerminalUid
        controller.fiscalizationMode = fiscalizationMode
        controller.connected = false

        controller.user_id = user.id

        const savedController = await this.Controller.create(controller)

        if(user.step < 2){
            user.step = 2
            await user.save()
        }

        return await this.Controller.find({
            where: {
                id: savedController.id
            }
        })
    }

    getVendistaId(controller){
        if(controller.uid.slice(0, 3) === "300") return controller.bankTerminalUid
        if(controller.uid.slice(0, 3) === "500") return controller.uid.slice(3)
    }

    async editController(id, input, user) {
        if (!user || !user.checkPermission(Permission.EDIT_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, revisionId, status, mode, readStatMode, bankTerminalMode, fiscalizationMode, remotePrinterId, simCardNumber, sim, imsiTerminal, cashless, bankTerminalUid} = input

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

        if (bankTerminalUid) {
            controller.bankTerminalUid = bankTerminalUid
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

        if (sim) {
            controller.sim = sim
        }

        if (cashless === null || cashless === "ON") {
            controller.cashless = cashless
        }

        if (imsiTerminal) {
            controller.imsiTerminal = imsiTerminal
        }
        else if(simCardNumber === "false"){
            controller.simCardNumber = null
        }



        if (controller.mode === "mdb" && controller.bankTerminalMode === "vda1"){
            await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(0), Commands.mdbCredit(10000), Commands.mdbTerminalMode(2), Commands.reload()])
        }
        if (controller.mode === "ps_m_D" && controller.bankTerminalMode === "vda1"){
            await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(1),  Commands.reload()])
        }
        // if (controller.mode === "mech" && controller.bankTerminalMode === "vda1"){
        //     await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(0), Commands.mdbCredit(10000), Commands.fixPaymentMode(1), Commands.mdbAlwaysIdle(1),  Commands.remotePin(0, 2, 20, 1), Commands.reload()])
        // }

        await controller.save()

        return this.getControllerById(id, user)
    }

    async editControllerGroupSettings(id, input, user) {
        if (!user || !user.checkPermission(Permission.EDIT_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, revisionId, status, mode, readStatMode, bankTerminalMode, fiscalizationMode, remotePrinterId, simCardNumber, sim, imsiTerminal} = input

        const controllers = await this.getAllOfCurrentUser(user)
        if(!controllers) return false

        return this.Controller.sequelize.transaction(async (transaction) => {

            for (let controller of controllers){
                const machine = await this.Machine.findOne({
                    transaction,
                    where: {
                        controller_id: controller.id
                    }
                })
                if(!machine) continue
                if(Number(machine.machine_group_id) !== Number(id) && Number(machine.machine_group2_id) !== Number(id)  && Number(machine.machine_group3_id) !== Number(id) &&  Number(id)  !== 0 ) continue


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

                if (sim) {
                    controller.sim = simCardNumber
                }

                if (imsiTerminal) {
                    controller.imsiTerminal = imsiTerminal
                }
                else if(simCardNumber === "false" || simCardNumber === "0" ){
                    controller.simCardNumber = null
                }

                await controller.save({transaction})

            }

            return true

        })



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


    async getControllerCommand(id, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const command = await this.redis.get("CONTROLLER_COMMAND_" + id)
        if (!command){
            return null
        }
        await this.redis.set("CONTROLLER_COMMAND_" + id, "", "EX", 24 * 60 * 60)
        return command
    }


    async getAll(offset, limit, status, connection, terminal, fiscalizationMode, bankTerminalMode, printer, registrationTime, terminalStatus, orderDesc, orderKey, userRole, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }

        const where = {}
        if (!limit) {
            limit = 50
        }
        if(userRole && userRole !== "ALL"){
            let roles = []
            if(userRole === "VENDOR"){
                roles.push("VENDOR")
                roles.push("VENDOR_NO_LEGAL_INFO")
                roles.push("VENDOR_NOT_CONFIRMED")
                roles.push("VENDOR_NEGATIVE_BALANCE")
                roles.push("PARTNER")
                roles.push("ADMIN")
            }
            else{
                roles.push(userRole)
            }
            const users = await this.User.findAll({where: {
                role: {
                    [Op.in]: roles
                }
            }})

            const userIds = users.map(u=> u.id)

            where.user_id = {
                [Op.in]: userIds
            }
        }
        if (bankTerminalMode && bankTerminalMode !== "ALL") {
            if(bankTerminalMode === "ENABLED"){
                where.bankTerminalMode = {
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
        if (printer && printer !== "ALL") {
            if(printer === "ENABLED"){
                where.remotePrinterId = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["0", "false", "FALSE", "False"],
                    }
                }
            }
            if(printer === "DISABLED"){
                where.remotePrinterId = {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.in]: ["0", "false", "FALSE", "False"]
                    }
                }
            }
        }

        if (registrationTime && registrationTime !== "ALL") {
            if(registrationTime === "ENABLED"){
                where.registrationTime = {
                    [Op.and]: {
                        [Op.not]: null
                    }
                }
            }
            if(registrationTime === "DISABLED"){
                where.registrationTime = {
                    [Op.or]: {
                        [Op.is]: null
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

        let orderData = ["id", "DESC"]

        if(orderDesc === true){
            orderData =["id"]
        }
        if(orderKey){
            if(orderKey === "id"){
                orderData[0] = orderKey
            }
            if(orderKey === "uid"){
                orderData[0] = orderKey
            }
            if(orderKey === "mode"){
                orderData[0] = orderKey
            }
            if(orderKey === "status"){
                orderData[0] = orderKey
            }
            if(orderKey === "fiscalizationMode"){
                orderData[0] = "fiscalization_mode"
            }

        }



        let controllers = await this.Controller.findAll({
            offset,
            limit,
            where,
            order: [
                orderData,
            ]
        })


        if(terminalStatus && terminalStatus !== "ALL"){
            const controllersFiltred = []

            for (let controller of controllers){
                if(controller.bankTerminalMode === "NO_BANK_TERMINAL") continue
                const machine = await this.machineService.getMachineByControllerId(controller.id, user)
                if(!machine) continue
                let status = await this.redis.get("terminal_status_" + machine.id)
                if(!status) status = "24H"
                if(status === terminalStatus ){  //&& controller.bankTerminalMode !== "NO_BANK_TERMINAL"
                    controllersFiltred.push(controller)
                }
            }
            controllers = controllersFiltred
        }

        if (connection && connection !== "ALL") {

            const filtredControllers = []
            for (let controller of controllers) {
                let lastState = await controller.getLastState()


                if(connection === "NO"){
                    if(!lastState) {
                        filtredControllers.push(controller)
                        continue
                    }
                    if(!lastState.registrationTime) {
                        filtredControllers.push(controller)
                        continue
                    }
                    let rt = lastState.registrationTime.getTime()
                    const to = new Date().getTime() - (1000 * 60 * 60 * 24)
                    const from = new Date().getTime() - (1000 * 60 * 60 * 24 * 365 * 10)
                    if( rt > from && rt <= to){
                        
                        filtredControllers.push(controller)
                        continue
                        
                    }
                    else{
                        continue
                    }
                }
                if(!lastState)continue
                if(!lastState.registrationTime)continue
                let rt = lastState.registrationTime.getTime()
                if(connection === "OK"){
                    const to = new Date().getTime()
                    const from = new Date().getTime() - (1000 * 60 * 15)
                    if( rt > from && rt <= to){
                        
                        filtredControllers.push(controller)
                        continue
                        
                    }
                    else{
                        continue
                    }
                    
                }
                if(connection === "WARNING"){
                    const to = new Date().getTime() - (1000 * 60 * 15)
                    const from = new Date().getTime() - (1000 * 60 * 30)
                    if( rt > from && rt <= to){
                        
                        filtredControllers.push(controller)
                        continue
                        
                    }
                    else{
                        continue
                    }
                }
                if(connection === "ALERT"){

                    const to = new Date().getTime() - (1000 * 60 * 30)
                    const from = new Date().getTime() - (1000 * 60 * 60 * 24)
                    if( rt > from && rt <= to){
                        
                        filtredControllers.push(controller)
                        continue
                        
                    }
                    else{
                        continue
                    }
                }

            }


            return filtredControllers

        }


        
        return controllers
    }

    async getAllOfCurrentUser(user, id) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }
        if(id){
            return await this.Controller.findAll({where: {user_id: id}})
        }
        return await this.Controller.findAll({where: {user_id: user.id}})
    }

    async getControllerIntegrations(user, imei) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }
        let integrations
        if(imei){
            integrations = await this.ControllerIntegration.findAll({where: {imei}})
        }
        else{
            integrations =await this.ControllerIntegration.findAll()
        }

        for(let item of integrations){
            if(!item.userId) continue

            item.user = await this.User.findOne({
                where: {
                    id: item.userId
                }
            })
        }
        return integrations
    }

    async getControllerPulse(controllerId, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_BY_ID)) {
            throw new NotAuthorized()
        }
        return await this.ControllerPulse.findOne({
            where: {
                controllerId
            }
        })
    }

    async setControllerPulse(input, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_BY_ID)) {
            throw new NotAuthorized()
        }
        let {controllerId, a, b, c, d, e, f, o, t} = input

        const pulse = await this.ControllerPulse.findOne({
            where: {
                controllerId
            }
        })
        if(!pulse){
            return this.ControllerPulse.create(input)
        }

        if(!a) a = 0
        if(!b) b = 0
        if(!c) c = 0
        if(!d) d = 0
        if(!e) e = 0
        if(!f) f = 0
        if(!o) o = 0
        if(!t) t = 0
        pulse.a = a
        pulse.b = b
        pulse.c = c
        pulse.d = d
        pulse.e = e
        pulse.f = f
        pulse.o = o
        pulse.t = t
        if(a > 1){
            const controller = await this.Controller.findOne({
                where: {
                    id: controllerId
                }
            })
            if (controller.mode === "mech" && controller.bankTerminalMode === "vda1" && a > 1 && b <= 1 && c <= 1 && d <= 1 && f <= 1){
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(0), Commands.fixPaymentMode(1), Commands.mdbAlwaysIdle(1),  Commands.remotePin(0, 2, 20, 1), Commands.mdbCredit(Number(a + "00")), Commands.reload()])
            }
            if (controller.mode === "mech" && controller.bankTerminalMode === "vda1" && a > 1 && (b > 1 || c > 1 || d > 1 || f > 1)){
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(1), Commands.reload()])
            }
        }


        await this.redis.set("CONTROLLER_COMMAND_" + controllerId, "reg", "EX", 24 * 60 * 60)
        return pulse.save()

    }


    async updateControllerIntegration(user, input) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }
        const {id, controllerUid} = input
        const integration =  await this.ControllerIntegration.findByPk(id)
        if(!integration){
            return new Error("Integration not found")
        }
        integration.controllerUid = controllerUid
        await integration.save()

        return integration
    }

    async getControllerUIDByIMEI(imei, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }

        // const uid = await this.redis.get("controller_integration_" + imei)
        // if(uid) return uid

        const integration =  await this.ControllerIntegration.findOne({
            where: {
                imei
            }
        })
        if(!integration){
            await this.ControllerIntegration.create({imei, type: "Vendista"})
            return ""
        }
        if(integration && !integration.controllerUid){
            return ""
        }

        //await this.redis.set("controller_integration_" + imei, imei, "EX", 60 * 60)
        return integration.controllerUid
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


    async updatePrinterOnController(input, user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_ERRORS)) {
            throw new NotAuthorized()
        }
        const {controllerId, printerId} = input
        const where = {
            id: controllerId
        }
        if(user.role !== "ADMIN"){
            where.user_id = user.id
        }

        const controller = await this.Controller.findOne({
            where
        })
        if(!controller) return false
        controller.remotePrinterId = printerId
        await controller.save()
        return true

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


    async lastState(id, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }

        const json = await this.redis.get("controller_last_state_" + id)
        const parse = JSON.parse(json)
        if(!parse) return null
        parse.registrationTime = new Date(parse.registrationTime)
        return parse
    }


    async simReset(sim, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }

        await microservices.sim.reset(sim)
        return true
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
        const fiscalControllers = allUserControllers.filter(controller => controller.fiscalizationMode !== "NO_FISCAL" && controller.status === "ENABLED")
        const tariff = await microservices.billing.getTariff("TELEMETRY", user.id)
        if(controller && controller.status === "ENABLED"){
            services.push({
                id: 1,
                name: "Услуги телеметрии",
                price: Number(tariff.telemetry),
                billingType: null
            })
        }

        if(controller && controller.status === "ENABLED" && controller.cashless === "ON"){

            services.push({
                id: 10,
                name: "Услуги эквайринга",
                price: Number(tariff.acquiring),
                billingType: null
            })


        }
        if(kktOk && allUserControllers &&  kktOk.length > 0){
            const price = fiscalControllers.length > (20 * kktOk.length) ? fiscalControllers.length * Number(tariff.fiscal) / 20 : Number(tariff.fiscal) * kktOk.length
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
            signalStrength,
            attentionRequired
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
            controllerState.attentionRequired = Boolean(attentionRequired)

            const machineError = await this.redis.get("machine_error_" + machine.id)
            if(machineError !== "NO SALES 24H"){
                await this.redis.set("machine_error_" + machine.id, `OK`, "EX", 24 * 60 * 60)
            }


            controllerState = await this.ControllerState.create(controllerState, {transaction})
            await this.redis.set("controller_last_state_" + controller.id, JSON.stringify(controllerState))

            if (lastState && !controller.connected) {
                //add log connection regain
                await this.machineService.addLog(machine.id, `Связь восстановлена`, MachineLogType.CONNECTION, machineUser, transaction)
                await this.redis.set("controller_connected_back" + machine.id, `OK`, "EX", 24 * 60 * 60)
            }
            if (controllerState.attentionRequired) {
                //add log connection regain
                await this.machineService.addLog(machine.id, `Автомат не работает`, MachineLogType.BUS_ERROR, machineUser, transaction)
                await this.redis.set("machine_error_" + machine.id, `ERROR`, "EX", 24 * 60 * 60)

                if(lastState.attentionRequired !== controllerState.attentionRequired){
                    if(controllerState.attentionRequired){
                        await this.redis.set("MACHINE_ATTENTION_REQUIRED_NOTIFICATION_" + machine.id, `ERROR`, "EX", 24 * 60 * 60)
                    }
                    else {
                        await this.redis.set("MACHINE_ATTENTION_REQUIRED_NOTIFICATION_" + machine.id, `OK`, "EX", 24 * 60 * 60)
                        await this.machineService.addLog(machine.id, `Автомат работает`, MachineLogType.BUS_ERROR, machineUser, transaction)

                    }
                }
            }


            controller.connected = true

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

        const result = await controller.save()
        const balance = await this.billingService.getBalance(user, controller.user_id)
        if(Number(balance) < -1000){
            result.bankTerminalMode = "d200s"
        }


        return result
    }

    async registerEvent(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER_EVENT)) {
            throw new NotAuthorized()
        }

        const {controllerUid, timestamp, eventType} = input

        if(eventType !== "ENCASHMENT") {
            throw new Error("Unknown event type")
        }

        const encash = await this.redis.get("machine_encashment_" + controllerUid + timestamp)
        if(encash) {
            throw new Error("DUBLICATE_ENCASHMENT")
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
        await this.redis.set("machine_encashment_" + machine.id, `${timestamp}`, "EX", 31 * 24 * 60 * 60)
        await this.redis.set("machine_encashment_" + controllerUid + timestamp, `${timestamp}`, "EX", 31 * 24 * 60 * 60)
        await this.machineService.addLog(machine.id, `Выполнена инкассация`, MachineLogType.ENCASHMENT, controllerUser)

        return controller
    }

    // async telemetronEvent(input, user) {
    //     if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER_EVENT)) {
    //         throw new NotAuthorized()
    //     }
    //
    //     const {imei, time, s, mdb, iccid, reason, qlt, bat, exe, mdb_product} = input
    //
    //     const newData = JSON.parse(objectString)
    //     const oldData = await this.redis.get("telemetron_controller_string_" + controllerUid)
    //
    //
    //
    //
    //
    //
    //     await this.redis.set("telemetron_controller_string_" + controllerUid, objectString, "EX", 24 * 60 * 60)
    //
    //     return true
    // }

}

module.exports = ControllerService
