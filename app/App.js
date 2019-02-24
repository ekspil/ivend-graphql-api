const Redis = require("ioredis")
const Sequelize = require("sequelize")
const {ApolloServer} = require("apollo-server")
const typeDefs = require("../graphqlTypedefs")
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
const ButtonItemService = require("./services/ButtonItemService")
const ServiceService = require("./services/ServiceService")
const RevisionService = require("./services/RevisionService")
const NotificationSettingsService = require("./services/NotificationSettingsService")
const LegalInfoService = require("./services/LegalInfoService")
const BillingService = require("./services/BillingService")

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

const redis = new Redis({
    port: 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
})


const logger = require("./utils/logger")

class App {

    async start() {

        const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
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
        })

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

        UserModel.belongsTo(LegalInfoModel, {foreignKey: "legal_info_id", as: "legalInfo"})
        NotificationSettingModel.belongsTo(UserModel, {foreignKey: "user_id"})
        const DepositModel = sequelize.define("deposits", Deposit)
        const PaymentRequestModel = sequelize.define("payment_requests", PaymentRequest)
        const TransactionModel = sequelize.define("transactions", Transaction)

        ItemModel.belongsTo(UserModel)
        TransactionModel.belongsTo(UserModel, {foreignKey: "user_id"})

        SaleModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})
        SaleModel.belongsTo(ItemModel, {foreignKey: "item_id"})
        SaleModel.belongsTo(ItemMatrixModel, {foreignKey: "item_matrix_id"})

        ButtonItemModel.belongsTo(ItemMatrixModel, {foreignKey: "item_matrix_id"})

        ItemMatrixModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ItemMatrixModel.hasMany(ButtonItemModel, {as: "buttons", foreignKey: "item_matrix_id"})

        ButtonItemModel.belongsTo(ItemModel, {foreignKey: "item_id"})

        ControllerErrorModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})

        // Controller relations
        ControllerModel.belongsTo(EquipmentModel, {foreignKey: "equipment_id", as: "equipment"})
        ControllerModel.belongsTo(RevisionModel, {foreignKey: "revision_id", as: "revision"})
        ControllerModel.belongsTo(BankTerminalModel, {foreignKey: "bank_terminal_id"})
        ControllerModel.belongsTo(FiscalRegistrarModel, {foreignKey: "fiscal_registrar_id"})

        // ItemMatrix
        ControllerModel.hasOne(ItemMatrixModel, {foreignKey: "controller_id", as: "itemMatrix"})
        ItemMatrixModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})


        ControllerModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ControllerModel.belongsTo(ControllerStateModel, {foreignKey: "last_state_id", as: "lastState"})

        EquipmentModel.hasMany(ControllerModel, {foreignKey: "equipment_id", as: "equipment"})
        FiscalRegistrarModel.hasMany(ControllerModel, {foreignKey: "bank_terminal_id"})
        BankTerminalModel.hasMany(ControllerModel, {foreignKey: "bank_terminal_id"})
        RevisionModel.hasMany(ControllerModel, {foreignKey: "revision_id"})

        DepositModel.belongsTo(UserModel, {foreignKey: "user_id"})
        DepositModel.belongsTo(PaymentRequestModel, {foreignKey: "payment_request_id", as: "paymentRequest"})

        ControllerModel.belongsToMany(ServiceModel, {
            through: "controller_services",
            foreignKey: "controller_id",
            otherKey: "service_id"
        })

        await sequelize.authenticate()
        await sequelize.sync({force: true})

        // Map for injecting
        const services = {
            userService: undefined,
            equipmentService: undefined,
            fiscalRegistrarService: undefined,
            bankTerminalService: undefined,
            itemService: undefined,
            buttonItemService: undefined,
            controllerService: undefined,
            saleService: undefined,
            serviceService: undefined,
            revisionService: undefined,
            notificationSettingsService: undefined,
            legalInfoService: undefined,
            billingService: undefined
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

        services.serviceService = new ServiceService({ServiceModel})


        services.itemService = new ItemService({ItemModel})

        services.buttonItemService = new ButtonItemService({
            ButtonItemModel,
            itemService: services.itemService,
            itemMatrixService: services.itemMatrixService
        })

        services.itemMatrixService = new ItemMatrixService({
            ItemMatrixModel,
            itemService: services.itemService,
            buttonItemService: services.buttonItemService,
            ButtonItemModel,
            ItemModel,
            UserModel
        })

        services.buttonItemService.itemMatrixService = services.itemMatrixService

        services.revisionService = new RevisionService({
            RevisionModel
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
            buttonItemService: services.buttonItemService,
            serviceService: services.serviceService,
            revisionService: services.revisionService
        })

        services.saleService = new SaleService({
            SaleModel,
            ItemModel,
            controllerService: services.controllerService,
            buttonItemService: services.buttonItemService,
            itemService: services.itemService
        })

        services.legalInfoService = new LegalInfoService({UserModel, LegalInfoModel})
        services.billingService = new BillingService({
            ControllerModel,
            DepositModel,
            PaymentRequestModel,
            ServiceModel,
            TransactionModel,
        })
        services.notificationSettingsService = new NotificationSettingsService({NotificationSettingModel})

        const populateWithFakeData = async () => {

            const user = await services.userService.registerUser({
                email: "test",
                phone: "9999999999",
                password: "test"
            })

            user.checkPermission = () => true

            const aggregatorUser = await services.userService.registerUser({
                email: "aggregator",
                phone: "9999999991",
                password: "aggregator"
            }, "AGGREGATE")

            aggregatorUser.checkPermission = () => true


            const equipment = await services.equipmentService.createEquipment({name: "test"}, user)

            const revision = await services.revisionService.createRevision({name: "1"}, user)

            await services.serviceService.createService({
                name: "Telemetry",
                price: 150,
                billingType: "DAILY",
                type: "CONTROLLER"
            }, user)

            // First test controller
            // No bank terminal and fiscal registrar
            // No applied services
            const firstController = {
                name: "First test controller",
                uid: "10000003-1217",
                equipmentId: equipment.id,
                revisionId: revision.id,
                status: "DISABLED",
                mode: "MDB",
                serviceIds: [1]
            }

            await services.controllerService.createController(firstController, user)
        }

        await populateWithFakeData()

        const resolvers = new Resolvers({
            ...services
        })

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: new ContextResolver({UserModel, redis}),
            introspection: true,
            playground: true
        })

        const serverInfo = await server.listen()

        logger.info(`GraphQL Server ready at ${serverInfo.url}`)

    }


}


module.exports = App
