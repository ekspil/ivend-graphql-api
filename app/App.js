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

const logger = require("./utils/logger")

class App {

    async start() {

        global.tokens = {}

        const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
            host: process.env.POSTGRES_HOST,
            dialect: "postgres",
            operatorsAliases: false,

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

        ItemModel.belongsTo(UserModel)

        SaleModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})
        SaleModel.belongsTo(ItemModel, {foreignKey: "item_id"})
        SaleModel.belongsTo(ItemMatrixModel, {foreignKey: "item_matrix_id"})

        ButtonItemModel.belongsTo(ItemMatrixModel)

        ItemMatrixModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ItemMatrixModel.hasMany(ButtonItemModel, {as: "buttons"})

        ButtonItemModel.belongsTo(ItemModel)

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

        const UserServicesModel = sequelize.define("user_services", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        })

        UserModel.belongsToMany(ServiceModel, {
            foreignKey: "user_id",
            otherKey: "service_id",
            through: UserServicesModel
        })
        ServiceModel.hasMany(UserModel)

        await sequelize.authenticate()
        await sequelize.sync({force: true})

        let revisionService = undefined

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
            revisionService,
        }

        services.userService = new UserService({
            UserModel
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

        services.serviceService = new ServiceService({ServiceModel, UserServicesModel})


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
            controllerService: services.controllerService,
            buttonItemService: services.buttonItemService,
            itemService: services.itemService
        })

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

            await services.serviceService.createService({name: "Telemetry", price: 1500}, user)

            // First test controller
            // No bank terminal and fiscal registrar
            // No applied services
            const firstController = {
                name: "First test controller",
                uid: "10000003-1217",
                equipmentId: equipment.id,
                revisionId: revision.id,
                status: "DISABLED",
                mode: "MDB"
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
            context: new ContextResolver(UserModel),
            introspection: true,
            playground: true
        })

        const serverInfo = await server.listen()

        logger.info(`GraphQL Server ready at ${serverInfo.url}`)

    }


}


module.exports = App
