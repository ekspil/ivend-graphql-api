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
const fetch = require("node-fetch")

class ControllerService {

    constructor({EncashmentModel, ItemModel, ControllerModel, ControllerErrorModel, MachineModel, ControllerStateModel, CubeTokenModel, ControllerIntegrationsModel, ControllerPulseModel, UserModel, RevisionModel, revisionService, machineService, kktService, redis, SaleModel, billingService}) {
        this.Controller = ControllerModel
        this.CubeToken = CubeTokenModel
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
        this.getCubeToken = this.getCubeToken.bind(this)
        this.getControllerServices = this.getControllerServices.bind(this)
        this.setControllerPulse = this.setControllerPulse.bind(this)
        this.getVendistaId= this.getVendistaId.bind(this)
        this.updateControllerIntegration= this.updateControllerIntegration.bind(this)
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
        controller.autoSetUp = false
        controller.connected = false

        controller.user_id = user.id

        const savedController = await this.Controller.create(controller)

        if(user.step < 2){
            user.step = 2
            await user.save()
        }

        return savedController
    }

    getVendistaId(controller){
        if(controller.uid.slice(0, 3) === "300") return controller.bankTerminalUid
        if(controller.uid.slice(0, 3) === "500") return controller.uid.slice(3)
    }

    async editController(id, input, user) {
        if (!user || !user.checkPermission(Permission.EDIT_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const {name, autoSetUp, revisionId, status, mode, readStatMode, bankTerminalMode, fiscalizationMode, remotePrinterId, simCardNumber, sim, imsiTerminal, cashless, bankTerminalUid} = input

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

        controller.autoSetUp = autoSetUp

        if (imsiTerminal) {
            controller.imsiTerminal = imsiTerminal
        }

        else if(simCardNumber === "false"){
            controller.simCardNumber = null
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
                    controller.sim = sim
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


    async getControllerCommand(id, user, notDelete) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const command = await this.redis.get("CONTROLLER_COMMAND_" + id)
        if (!command){
            return null
        }
        if(!notDelete){
            await this.redis.set("CONTROLLER_COMMAND_" + id, "", "EX", 24 * 60 * 60)
        }

        return command
    }


    async getAll(offset, limit, status, connection, terminal, fiscalizationMode, bankTerminalMode, printer, registrationTime, terminalStatus, orderDesc, orderKey, userRole, search, userId, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }

        let where = {}
        if (!limit) {
            limit = 50
        }
        // if(userRole && userRole !== "ALL"){
        //     let roles = []
        //     if(userRole === "VENDOR"){
        //         roles.push("VENDOR")
        //         roles.push("VENDOR_NO_LEGAL_INFO")
        //         roles.push("VENDOR_NOT_CONFIRMED")
        //         roles.push("VENDOR_NEGATIVE_BALANCE")
        //         roles.push("PARTNER")
        //         roles.push("ADMIN")
        //     }
        //     else{
        //         roles.push(userRole)
        //     }
        //     const users = await this.User.findAll({where: {
        //         role: {
        //             [Op.in]: roles
        //         }
        //     }})
        //
        //     const userIds = users.map(u=> u.id)
        //
        //     where.user_id = {
        //         [Op.in]: userIds
        //     }
        // }
        if(search && search.length > 3) {
            where = {
                [Op.or]: [
                    {
                        uid: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        mode: {
                            [Op.like]: `%${search}%`
                        }
                    },
                ]
            }
        }
        if(userId){
            where.user_id = Number(userId)
        }
        if (bankTerminalMode && bankTerminalMode !== "ALL") {
            if (bankTerminalMode === "ENABLED") {
                where.bankTerminalMode = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["NO_BANK_TERMINAL"]
                    }
                }
            }
            if (bankTerminalMode === "DISABLED") {
                where.bankTerminalMode = {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.in]: ["NO_BANK_TERMINAL"]
                    }
                }
            }
        }
        if (printer && printer !== "ALL") {
            if (printer === "ENABLED") {
                where.remotePrinterId = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["0", "false", "FALSE", "False"],
                    }
                }
            }
            if (printer === "DISABLED") {
                where.remotePrinterId = {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.in]: ["0", "false", "FALSE", "False"]
                    }
                }
            }
        }

        if (registrationTime && registrationTime !== "ALL") {
            if (registrationTime === "ENABLED") {
                where.registrationTime = {
                    [Op.and]: {
                        [Op.not]: null
                    }
                }
            }
            if (registrationTime === "DISABLED") {
                where.registrationTime = {
                    [Op.or]: {
                        [Op.is]: null
                    }
                }
            }
        }
        if (terminal) {
            if (terminal === "ENABLED") {
                where.simCardNumber = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["false", "FALSE", "0"]
                    }
                }
            }
            if (terminal === "DISABLED") {
                where.simCardNumber = {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.in]: ["false", "FALSE", "0"]
                    }
                }
            }

        }
        if (fiscalizationMode && fiscalizationMode !== "ALL") {
            if (fiscalizationMode === "ENABLED") {
                where.fiscalizationMode = {
                    [Op.and]: {
                        [Op.not]: null,
                        [Op.notIn]: ["NO_FISCAL"]
                    }
                }
            }
            if (fiscalizationMode === "DISABLED") {
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

    async getControllerIntegrations(user, input) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }

        const {search, limit, offset} = input
        let integrations
        if(search && search.length > 3){
            const where = {
                [Op.or]: [
                    { controllerUid: {
                        [Op.like]: `%${search}%`
                    } },
                    { imei: {
                        [Op.like]: `%${search}%`
                    } },
                    { serial: {
                        [Op.like]: `%${search}%`
                    } }
                ]
            }


            integrations = await this.ControllerIntegration.findAll({
                where,
                limit,
                offset,
                order: [
                    ["id", "DESC"],
                ]
            })
            
            if(integrations.length === 0){

                const usersFind = await this.User.findAll({
                    where : {
                        [Op.or]: [
                            { companyName: {
                                [Op.like]: `%${search}%`
                            } }
                        ]
                    }
                })
                if(usersFind && usersFind.length > 0){

                    integrations = await this.ControllerIntegration.findAll({
                        where: {
                            userId: {
                                [Op.in]: usersFind.map(item => {
                                    return item.id
                                })
                            }
                        },
                        order: [
                            ["id", "DESC"],
                        ]
                    })
                }

            }
        }
        else{
            integrations = await this.ControllerIntegration.findAll({
                limit,
                offset,
                order: [
                    ["id", "DESC"],
                ]
            })
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
        let {controllerId, a, b, c, d, e, f, o, t, commands} = input
        let randomCommands
        try{

            randomCommands = JSON.parse(commands)
        }catch (e) {
            commands = null
            logger.error(e.message)
        }

        let pulse = await this.ControllerPulse.findOne({
            where: {
                controllerId
            }
        })
        if(!pulse){
            pulse = await this.ControllerPulse.create(input)
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
        pulse.randomCommands = commands
        const controller = await this.Controller.findOne({
            where: {
                id: controllerId
            }
        })
        if(!controller.autoSetUp) return pulse.save()


        if (controller.mode === "mdb" && controller.bankTerminalMode === "vda1"){
            await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(0), Commands.mdbCredit(10000), Commands.mdbTerminalMode(2)])
        }
        if (controller.mode === "ps_m_D" && controller.bankTerminalMode === "vda1"){
            if (controller.uid.slice(0, 3) === "300"){
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(1),  ])
            }

        }
        if (controller.mode === "rs232" && controller.bankTerminalMode === "vda1"){

            if (controller.uid.slice(0, 3) === "300"){
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(1), ])
            }
        }




        if (controller.uid.slice(0, 3) === "500") {
            if (controller.mode === "mech" && controller.bankTerminalMode === "vda1" && a > 0 && b < 1 && c < 1 && d < 1 && f < 1) {
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(3), Commands.remotePin(0, 0, 20, 1), Commands.priceSettingPulse(3, 0, 0), Commands.priceForPulse(0, 0, Number(a + "00"), 0, 0, 0)])
            }
            if (controller.mode === "mech" && controller.bankTerminalMode === "vda1" && a > 0 && (b > 0 || c > 0 || d > 0 || f > 0)) {
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(3), Commands.remotePin(0, 0, 20, 1), Commands.priceSettingPulse(2, 0, 0), Commands.priceForPulse(Number(a + "00"), Number(b + "00"), Number(c + "00"), 0, 0, 0)])
            }
        }
        if (controller.uid.slice(0, 3) === "300") {
            if (controller.mode === "mech" && controller.bankTerminalMode === "vda1" && a > 0 && (b > 0 || c > 0 || d > 0 || f > 0)) {
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(1)])
            }
        }
        if (controller.mode === "ps_m_D" && controller.bankTerminalMode === "vda1"){
            if (controller.uid.slice(0, 3) === "500"){
                await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reset(), Commands.workMode(3), Commands.remotePin(0, 2,2, 0), Commands.sniffer(5, 1, Number(o + "00") , Number(a + "00"), 15, Number(b + "00"),3), Commands.priceForPulse(Number(t + "00"), 0, 0, 0, 0, 0)])
            }

        }
        if(controller.bankTerminalMode === "vda1" && (controller.uid.slice(0, 3) === "500" || controller.uid.slice(0, 3) === "300")){

            if (randomCommands && randomCommands.length > 0){
                await microservices.vendista.sendCommands(this.getVendistaId(controller), randomCommands)

            }
            await microservices.vendista.sendCommands(this.getVendistaId(controller), [Commands.reload()])
        }

        


        await this.redis.set("CONTROLLER_COMMAND_" + controllerId, "reg", "EX", 24 * 60 * 60)
        return pulse.save()

    }


    async updateControllerIntegration(user, input) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS)) {
            throw new NotAuthorized()
        }
        const {id, controllerUid, userId} = input
        const integration =  await this.ControllerIntegration.findByPk(id)
        if(!integration){
            return new Error("Integration not found")
        }
        if(controllerUid === "DELETE"){
            integration.controllerUid = null
            integration.controllerId = null
            integration.userId = null
            integration.serial = null
        }
        else if(controllerUid === "DELETE_FORCE"){
            await integration.destroy()
            return null
        }
        else{
            const controllerUser = await this.User.findByPk(userId)
            if(!controllerUser){
                throw new Error ("USER_NOT_FOUND")
            }
            controllerUser.checkPermission = ()=> true

            const createdController = await this.createController({name: `vendista-${controllerUid}`, uid: controllerUid, revisionId: 1, status: "ENABLED", mode: "ps_m_D", readStatMode: "COINBOX", bankTerminalMode: "vda1", fiscalizationMode: "NO_FISCAL", bankTerminalUid: null}, controllerUser)
            integration.controllerUid = createdController.uid
            integration.controllerId = createdController.id
            integration.userId = controllerUser.id
            integration.serial = "SELF_CREATED"
        }
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


    async getCubeToken(user) {
        if (!user || !user.checkPermission(Permission.GET_CUBE_TOKEN)) {
            throw new NotAuthorized()
        }
        const url = process.env.AQSI_URL || "https://api-cube.aqsi.ru"
        try {

            const oldToken = await this.CubeToken.findOne({
                order: [
                    ["id", "DESC"],
                ]
            })

            const newToken = await fetch(url + "/tlm/v1/auth/refreshToken", {
                headers: {
                    Authorization: "Bearer " + oldToken.token
                }
            })
            if(newToken.status !== 200) return null

            const json = await newToken.json()


            await this.CubeToken.create({token: json.access_token})

            await this.redis.set("AQSI_CUBE_TOKEN", json.access_token, "EX", 14*24*60*60)
            return json.access_token
        }
        catch (e) {
            logger.error("cube_token_request_error " + e.message)
            return null
        }






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
        if(!json) return null
        const parse = JSON.parse(json)
        if(!parse) return null
        parse.registrationTime = new Date(parse.registrationTime)
        return parse
    }



    async updateCubeStatus(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER_EVENT)) {
            throw new NotAuthorized()
        }

        const {controllerUid, status} = input
        const currentStatus = await this.redis.hget("cube_current_status", controllerUid)
        await this.redis.hset("cube_current_status", controllerUid, status)

        return currentStatus || "offline"

    }


    async simReset(sim, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }

        await microservices.sim.reset(sim)
        return true
    }

    async getControllerServices(id, user, userId) {
        if (!user || !user.checkPermission(Permission.GET_ALL_CONTROLLERS_OF_CURRENT_USER)) {
            throw new NotAuthorized()
        }
        let selectedUser = user
        if(userId){
            selectedUser = await this.User.findByPk(userId)
            selectedUser.checkPermission = ()=> true
        }
        const services = []
        const controller = await this.getControllerById(id,  selectedUser)
        const allUserControllers = await this.getAllOfCurrentUser(selectedUser)
        const kkts = await this.kktService.getUserKkts(selectedUser)
        const kktOk = kkts.filter(kkt => kkt.kktActivationDate && kkt.type !== "orange")
        const kktOrange = kkts.filter(kkt => kkt.type === "orange")
        const fiscalControllers = allUserControllers.filter(controller => controller.fiscalizationMode !== "NO_FISCAL" && controller.status === "ENABLED")
        const tariff = await microservices.billing.getTariff("TELEMETRY", selectedUser.id)
        function isSmart(controller){
            if(controller.uid.slice(0, 3) === "400"){
                return true
            }
            if(controller.uid.slice(0, 3) === "200"){
                return true
            }
            if(controller.uid.slice(0, 3) === "500"){
                return true
            }
            return false
        }


        if(controller && controller.status === "ENABLED"  && isSmart(controller)){
            services.push({
                id: 50,
                name: "Абонентская плата за Услугу телеметрии Смарт-терминала",
                price: Number(tariff.smart),
                billingType: null
            })
        }


        if(kktOrange && kktOrange.length > 0){


            services.push({
                id: 60,
                name: "Услуга почековой фискализации Автоматов",
                price: 0.25,
                billingType: null,
                fixCount: 1
            })
        }


        if(controller && controller.status === "ENABLED"  && !isSmart(controller)){
            services.push({
                id: 1,
                name: "Абонентская плата за Услугу телеметрии Контроллера",
                price: Number(tariff.telemetry),
                billingType: null
            })
        }

        if(controller && controller.status === "ENABLED" && controller.cashless === "ON" && !isSmart(controller)){

            services.push({
                id: 10,
                name: "Абонентская плата за Услугу телеметрии Терминала",
                price: Number(tariff.acquiring),
                billingType: null
            })


        }
        if(kktOk && allUserControllers && kktOk.length > 0){
            const price = fiscalControllers.length > (20 * kktOk.length) ? fiscalControllers.length * Number(tariff.fiscal) / 20 : Number(tariff.fiscal) * kktOk.length
            services.push({
                id: 5,
                name: "Абонентская плата за Услугу фискализации сети Автоматов",
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


    async registerState(controllerStateInput, user, data) {
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


        let controller = await this.getControllerByUID(controllerUid, user)

        if (!controller) {
            if(controllerUid.startsWith("200")){




                if(!data || !data.deviceId) throw new ControllerNotFound()

                let token = await this.redis.get("AQSI_CUBE_TOKEN")
                if(!token){
                    const u = {}
                    u.checkPermission = ()=> true
                    token = await this.getCubeToken(u)
                }

                const device = await microservices.aqsi.getAqsiDevice(data.deviceId, token)

                if(!device || !device.inn) throw new Error("AQSI_ERROR Не получены данные от сервера акси")

                const user = await this.User.findOne({
                    where: {
                        inn: device.inn
                    }
                })

                if(!user) throw new Error("AQSI_ERROR Не найден пользователь по ИНН")

                controller = {}
                controller.revision_id = 1
                controller.name = "Cube " + controllerUid
                controller.uid = controllerUid
                controller.revision = 1
                controller.status = "DISABLED"
                controller.mode = "ps_m_D"
                controller.readStatMode = "COINBOX"
                controller.bankTerminalMode = "NO_BANK_TERMINAL"
                controller.bankTerminalUid = null
                controller.fiscalizationMode = "NO_FISCAL"
                controller.autoSetUp = false
                controller.connected = false
                controller.registrationTime = new Date()
                controller.firmwareId = "aqsi 1.0"


                controller.user_id = user.id

                return this.Controller.create(controller)
            }





            throw new ControllerNotFound()
        }

        const machine = await this.machineService.getMachineByControllerId(controller.id, user)

        if (!machine) {
            throw new Error("Machine not found")
        }

        const machineUser = await machine.getUser()
        machineUser.checkPermission = () => true

        const lastStateJson = await this.redis.get("controller_last_state_" + controller.id)
        let lastState
        if(lastStateJson){
            lastState = JSON.parse(lastStateJson)
        }
        //const lastState = await controller.getLastState()
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

            const controllerConnected = Boolean(await this.redis.hget("controller_connected", controller.id))
            controllerState = await this.ControllerState.create(controllerState, {transaction})
            await this.redis.set("controller_last_state_" + controller.id, JSON.stringify(controllerState.dataValues))

            if (lastState && !controllerConnected) {
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


            //controller.connected = true
            // //
            // controller.last_state_id = controllerState.id
            //
            // await this.redis.hset("controller_last_state_id", controller.id, controllerState.id)
            await this.redis.hset("controller_connected", controller.id, true)
            //const controllerConnected = Boolean(await this.redis.hget("controller_connected", controller.id))

            return controller
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
        await this.redis.set("CONTROLLER_COMMAND_" + controller.id, "", "EX", 24 * 60 * 60)

        return result
    }

    async registerEvent(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_CONTROLLER_EVENT)) {
            throw new NotAuthorized()
        }

        const {controllerUid, timestamp, eventType} = input

        if(eventType !== "ENCASHMENT" && eventType !== "UPDATE" ) {
            throw new Error("Unknown event type")
        }

        if(eventType === "ENCASHMENT"){

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
        if(eventType === "UPDATE"){

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


            await this.redis.set("CONTROLLER_COMMAND_" + controller.id, "upd", "EX", 24 * 60 * 60)
            await this.machineService.addLog(machine.id, `Запрос обновления`, MachineLogType.ALL, controllerUser)
            return controller
        }
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
