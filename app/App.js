const Redis = require("ioredis")
const Sequelize = require("sequelize")
const {ApolloServer} = require("apollo-server")
const typeDefs = require("../graphqlTypedefs")

const ControllerMode = require("./enum/ControllerMode")
const ControllerStatus = require("./enum/ControllerStatus")
const SaleType = require("./enum/SaleType")

const Resolvers = require("./resolvers")

const ContextResolver = require("./resolvers/ContextResolver")

const UserService = require("./services/UserService")
const ControllerService = require("./services/ControllerService")
const EquipmentService = require("./services/EquipmentService")
const FiscalRegistrarService = require("./services/FiscalRegistrarService")
const BankTerminalService = require("./services/BankTerminalService")
const SaleService = require("./services/SaleService")
const ItemService = require("./services/ItemService")
const ItemMatrixService = require("./services/ItemMatrixService")
const ServiceService = require("./services/ServiceService")
const RevisionService = require("./services/RevisionService")
const NotificationSettingsService = require("./services/NotificationSettingsService")
const LegalInfoService = require("./services/LegalInfoService")
const BillingService = require("./services/BillingService")
const ReportService = require("./services/ReportService")
const MachineService = require("./services/MachineService")

const User = require("./models/sequelize/User")
const BankTerminal = require("./models/sequelize/BankTerminal")
const FiscalRegistrar = require("./models/sequelize/FiscalRegistrar")
const Equipment = require("./models/sequelize/Equipment")
const Item = require("./models/sequelize/Item")
const Sale = require("./models/sequelize/Sale")
const ButtonItem = require("./models/sequelize/ButtonItem")
const ItemMatrix = require("./models/sequelize/ItemMatrix")
const Controller = require("./models/sequelize/Controller")
const ControllerState = require("./models/sequelize/ControllerState")
const ControllerError = require("./models/sequelize/ControllerError")
const Service = require("./models/sequelize/Service")
const Revision = require("./models/sequelize/Revision")
const NotificationSetting = require("./models/sequelize/NotificationSetting")
const LegalInfo = require("./models/sequelize/LegalInfo")
const Deposit = require("./models/sequelize/Deposit")
const PaymentRequest = require("./models/sequelize/PaymentRequest")
const Transaction = require("./models/sequelize/Transaction")
const ControllerServices = require("./models/sequelize/ControllerServices")
const Machine = require("./models/sequelize/Machine")
const MachineGroup = require("./models/sequelize/MachineGroup")
const MachineType = require("./models/sequelize/MachineType")

const redis = new Redis({
    port: 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
})


const logger = require("./utils/logger")

class App {

    async start() {

        const sequelizeOptions = {
            host: process.env.POSTGRES_HOST,
            dialect: "postgres",
            operatorsAliases: false,
            logging: process.env.NODE_ENV !== "production",

            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        }

        if (process.env.SQL_LOGS) {
            sequelizeOptions.logging = !!Number(process.env.SQL_LOGS)
        }

        const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, sequelizeOptions)

        const UserModel = sequelize.define("users", User)
        const BankTerminalModel = sequelize.define("bank_terminals", BankTerminal)
        const FiscalRegistrarModel = sequelize.define("fiscal_registrars", FiscalRegistrar)
        const EquipmentModel = sequelize.define("equipments", Equipment)
        const ItemModel = sequelize.define("items", Item)
        const SaleModel = sequelize.define("sales", Sale)
        const ButtonItemModel = sequelize.define("button_items", ButtonItem)
        const ItemMatrixModel = sequelize.define("item_matrixes", ItemMatrix)
        const ControllerModel = sequelize.define("controllers", Controller)
        const ControllerStateModel = sequelize.define("controller_states", ControllerState)
        const ControllerErrorModel = sequelize.define("controller_errors", ControllerError)
        const ServiceModel = sequelize.define("services", Service)
        const RevisionModel = sequelize.define("revisions", Revision)
        const NotificationSettingModel = sequelize.define("notification_settings", NotificationSetting)
        const LegalInfoModel = sequelize.define("legal_infos", LegalInfo)
        const DepositModel = sequelize.define("deposits", Deposit)
        const PaymentRequestModel = sequelize.define("payment_requests", PaymentRequest)
        const TransactionModel = sequelize.define("transactions", Transaction)
        const MachineModel = sequelize.define("machines", Machine)
        const MachineGroupModel = sequelize.define("machine_groups", MachineGroup)
        const MachineTypeModel = sequelize.define("machine_types", MachineType)

        sequelize.define("controller_services", ControllerServices)

        UserModel.belongsTo(LegalInfoModel, {
            foreignKey: "legal_info_id",
            as: "legalInfo"
        })

        NotificationSettingModel.belongsTo(UserModel, {foreignKey: "user_id"})

        ItemModel.belongsTo(UserModel, {foreignKey: "user_id"})
        TransactionModel.belongsTo(UserModel, {foreignKey: "user_id"})

        SaleModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})
        SaleModel.belongsTo(ItemModel, {foreignKey: "item_id"})

        ButtonItemModel.belongsTo(ItemMatrixModel, {foreignKey: "item_matrix_id"})

        ItemMatrixModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ItemMatrixModel.hasMany(ButtonItemModel, {
            as: "buttons",
            foreignKey: "item_matrix_id"
        })

        ButtonItemModel.belongsTo(ItemModel, {foreignKey: "item_id"})

        ControllerErrorModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})

        // Controller relations
        ControllerModel.belongsTo(RevisionModel, {
            foreignKey: "revision_id",
            as: "revision"
        })
        ControllerModel.belongsTo(BankTerminalModel, {foreignKey: "bank_terminal_id"})
        ControllerModel.belongsTo(FiscalRegistrarModel, {foreignKey: "fiscal_registrar_id"})

        // ItemMatrix
        ControllerModel.hasOne(ItemMatrixModel, {
            foreignKey: "controller_id",
            as: "itemMatrix"
        })
        ItemMatrixModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})

        ControllerModel.belongsTo(MachineModel, {foreignKey: "machine_id"})
        ControllerModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ControllerModel.belongsTo(ControllerStateModel, {
            foreignKey: "last_state_id",
            as: "lastState"
        })

        EquipmentModel.hasMany(ControllerModel, {
            foreignKey: "equipment_id",
            as: "equipment"
        })
        FiscalRegistrarModel.hasMany(ControllerModel, {foreignKey: "bank_terminal_id"})
        BankTerminalModel.hasMany(ControllerModel, {foreignKey: "bank_terminal_id"})
        RevisionModel.hasMany(ControllerModel, {foreignKey: "revision_id"})

        DepositModel.belongsTo(UserModel, {foreignKey: "user_id"})
        DepositModel.belongsTo(PaymentRequestModel, {
            foreignKey: "payment_request_id",
            as: "paymentRequest"
        })

        ControllerModel.belongsToMany(ServiceModel, {
            through: "controller_services",
            foreignKey: "controller_id",
            otherKey: "service_id"
        })

        MachineModel.belongsTo(EquipmentModel, {
            foreignKey: "equipment_id",
            as: "equipment"
        })
        MachineModel.belongsTo(MachineGroupModel, {
            foreignKey: "machine_group_id",
            as: "group"
        })
        MachineModel.belongsTo(MachineTypeModel, {
            foreignKey: "machine_type_id",
            as: "type"
        })
        MachineModel.belongsTo(UserModel, {
            foreignKey: "user_id",
            as: "user"
        })
        MachineGroupModel.belongsTo(UserModel, {
            foreignKey: "user_id",
            as: "user"
        })

        await sequelize.authenticate()


        // Map for injecting
        const services = {
            userService: undefined,
            equipmentService: undefined,
            fiscalRegistrarService: undefined,
            bankTerminalService: undefined,
            itemService: undefined,
            controllerService: undefined,
            saleService: undefined,
            serviceService: undefined,
            revisionService: undefined,
            notificationSettingsService: undefined,
            legalInfoService: undefined,
            reportService: undefined,
            billingService: undefined,
            machineService: undefined
        }

        services.userService = new UserService({
            UserModel,
            redis
        })

        services.equipmentService = new EquipmentService({
            EquipmentModel
        })

        services.fiscalRegistrarService = new FiscalRegistrarService({
            FiscalRegistrarModel
        })

        services.bankTerminalService = new BankTerminalService({
            BankTerminalModel
        })

        services.itemService = new ItemService({ItemModel})

        services.itemMatrixService = new ItemMatrixService({
            ItemMatrixModel,
            itemService: services.itemService,
            ButtonItemModel,
            ItemModel,
            UserModel
        })

        services.revisionService = new RevisionService({
            RevisionModel
        })

        services.machineService = new MachineService({
            MachineModel,
            MachineGroupModel,
            MachineTypeModel,
            equipmentService: services.equipmentService
        })

        services.controllerService = new ControllerService({
            ControllerModel,
            ControllerStateModel,
            ControllerErrorModel,
            EquipmentModel,
            ItemMatrixModel,
            ButtonItemModel,
            UserModel,
            RevisionModel,
            equipmentService: services.equipmentService,
            fiscalRegistrarService: services.fiscalRegistrarService,
            bankTerminalService: services.bankTerminalService,
            itemMatrixService: services.itemMatrixService,
            serviceService: services.serviceService,
            revisionService: services.revisionService,
            machineService: services.machineService
        })

        services.serviceService = new ServiceService({ServiceModel, controllerService: services.controllerService})
        services.controllerService.serviceService = services.serviceService

        services.saleService = new SaleService({
            SaleModel,
            ItemModel,
            ButtonItemModel,
            controllerService: services.controllerService,
            itemService: services.itemService
        })

        services.legalInfoService = new LegalInfoService({
            UserModel,
            LegalInfoModel
        })
        services.billingService = new BillingService({
            ControllerModel,
            DepositModel,
            PaymentRequestModel,
            ServiceModel,
            TransactionModel,
        })
        services.notificationSettingsService = new NotificationSettingsService({NotificationSettingModel})
        services.reportService = new ReportService({})


        const populateWithFakeData = async () => {
            Array.prototype.randomElement = function () {
                return this[Math.floor(Math.random() * this.length)]
            }

            const adminUser = await services.userService.registerUser({
                email: "admin",
                phone: "9997777777",
                password: "admin"
            }, "ADMIN")

            adminUser.checkPermission = () => true


            const aggregatorUser = await services.userService.registerUser({
                email: "aggregator",
                phone: "9999999991",
                password: "aggregator"
            }, "AGGREGATE")

            aggregatorUser.checkPermission = () => true


            const equipment = await services.equipmentService.createEquipment({name: "First equpment"}, adminUser)
            const revision = await services.revisionService.createRevision({name: "1"}, adminUser)
            await services.serviceService.createService({
                name: "Telemetry",
                price: 150,
                billingType: "DAILY",
                type: "CONTROLLER"
            }, adminUser)


            // Create test user
            const user = await services.userService.registerUser({
                email: "test",
                phone: "9999999999",
                password: "test"
            })
            user.checkPermission = () => true

            // Create test user with invalid token
            const invalidTokenUser = await services.userService.registerUser({
                email: "test_invalid_token",
                phone: "9999949999",
                password: "test_invalid_token"
            })
            invalidTokenUser.checkPermission = () => true


            await services.machineService.createMachineType({name: "Общий"}, adminUser)
            await services.machineService.createMachineGroup({name: "Общий"}, user)

            // Create some items for test user
            const items = []

            items.push(await services.itemService.createItem({name: "Кофе"}, user))
            items.push(await services.itemService.createItem({name: "Какао"}, user))
            items.push(await services.itemService.createItem({name: "Капучино"}, user))
            items.push(await services.itemService.createItem({name: "Американо"}, user))
            items.push(await services.itemService.createItem({name: "Горячее молоко"}, user))
            items.push(await services.itemService.createItem({name: "Горячий шоколад"}, user))


            const now = new Date()
            const startDate = new Date()
            startDate.setDate(now.getDate() - 3)


            // Create 10 test controllers
            for (let i = 0; i < 1; i++) {
                const machine = await services.machineService.createMachine({
                    "number": "1-" + i,
                    "name": i + " machine",
                    "place": "Place",
                    "groupId": 1,
                    "typeId": 1,
                    "equipmentId": 1
                }, user)


                const controllerInput = {
                    name: `${i + 1} test controller`,
                    uid: `10000003-${i + 1}`,
                    equipmentId: equipment.id,
                    revisionId: revision.id,
                    status: Object.keys(ControllerStatus).randomElement(),
                    mode: Object.keys(ControllerMode).randomElement(),
                    serviceIds: [1],
                    machineId: machine.id
                }


                const controller = await services.controllerService.createController(controllerInput, user)

                logger.info(`Created test controller uid: ${controller.uid}`)

                for (const [index, item] of items.entries()) {
                    await services.itemMatrixService.addButtonToItemMatrix({
                        itemMatrixId: controller.itemMatrix.id,
                        buttonId: index,
                        itemId: item.id
                    }, user)
                }

                const itemMatrix = await controller.getItemMatrix()
                const buttons = await itemMatrix.getButtons()

                // Generate sales for this controller from 3 days behind

                // 15% chance to trigger sale in the hour
                while (startDate < now) {
                    const howManySalesInHour = [0, 1, 2, 3, 4].randomElement()

                    for (let i = 0; i < howManySalesInHour; i++) {
                        const randomButton = buttons.randomElement()
                        const buttonId = randomButton.buttonId
                        const type = Object.keys(SaleType).randomElement()
                        const price = [10, 20, 40, 30, 50, 55, 15].randomElement()
                        const item = await randomButton.getItem()
                        const itemId = item.id
                        const controllerId = controller.id
                        const time = startDate

                        const saleInput = {buttonId, type, price, itemId, controllerId, time}

                        await services.saleService.createSale(saleInput, user)
                    }

                    const currentHour = startDate.getHours()
                    startDate.setHours(currentHour + 1)
                }

                startDate.setDate(now.getDate() - 3)
            }


            // Add deposit
            await sequelize.queryInterface.bulkInsert("payment_requests", [{
                idempotence_key: "test_key",
                to: "9999999999",
                payment_id: "test_payment_id",
                redirect_url: "test",
                status: "succeeded",
                created_at: startDate,
                updated_at: startDate
            }])

            const paymentRequests = await sequelize.query("SELECT * FROM payment_requests", {model: PaymentRequestModel})
            const [paymentRequest] = paymentRequests.filter(paymentRequest => paymentRequest.dataValues.payment_id === "test_payment_id")

            const amount = 50000

            sequelize.queryInterface.bulkInsert("deposits", [{
                amount,
                user_id: user.id,
                payment_request_id: paymentRequest.id,
                created_at: startDate,
                updated_at: startDate
            }])
            const deposits = await sequelize.query("SELECT * FROM deposits", {model: DepositModel})
            const [deposit] = deposits.filter(deposit => Number(deposit.amount) === amount)

            await sequelize.queryInterface.bulkInsert("transactions", [{
                amount,
                meta: `deposit_${deposit.id}`,
                user_id: user.id,
                created_at: startDate,
                updated_at: startDate
            }])


            // Add transactions
            const controllers = await services.controllerService.getAllOfCurrentUser(user)

            //get start date

            for (const controller of controllers) {
                for (let i = 0; startDate < now; i++) {
                    if (startDate.getHours() > 1) {
                        startDate.setHours(0)
                        startDate.setDate(startDate.getDate() + 1)
                        continue
                    }
                    const billTime = new Date(startDate.getTime())
                    billTime.setHours(1)
                    billTime.setMinutes(0)

                    const services = await controller.getServices()

                    for (const service of services) {
                        await sequelize.queryInterface.bulkInsert("transactions", [{
                            amount: -service.price,
                            meta: `${service.name.toLowerCase()}_${service.id}_${controller.id}`,
                            user_id: user.id,
                            created_at: startDate,
                            updated_at: startDate
                        }])
                    }
                    startDate.setDate(startDate.getDate() + 1)
                }
                startDate.setDate(now.getDate() - 3)
                startDate.setHours(now.getHours())
                startDate.setMinutes(now.getMinutes())
            }


        }

        if (Number(process.env.FORCE_SYNC) === 1) {
            await sequelize.sync({force: true})
            await populateWithFakeData()
        }

        const resolvers = new Resolvers({
            ...services
        })

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: new ContextResolver({
                UserModel,
                redis
            }),
            /*formatError: (error) => {
                logger.error(error)

                return new Error("Internal server error")
            },*/
            introspection: process.env.NODE_ENV === "development",
            playground: process.env.NODE_ENV === "development"
        })

        const serverInfo = await server.listen()

        logger.info(`GraphQL Server ready at ${serverInfo.url}`)

    }


}


module.exports = App
