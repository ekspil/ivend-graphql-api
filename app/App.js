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

const logger = require("./utils/logger")

class App {

    async start() {

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

        // Equipment
        EquipmentModel.hasMany(ControllerModel, {foreignKey: "equipment_id", as: "equipment"})
        ControllerModel.belongsTo(EquipmentModel, {foreignKey: "equipment_id", as: "equipment"})

        // ItemMatrix
        ControllerModel.hasOne(ItemMatrixModel, {foreignKey: "controller_id", as: "itemMatrix"})
        ItemMatrixModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})


        ControllerModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ControllerModel.hasOne(ControllerStateModel, {foreignKey: "last_state_id"})

        ControllerModel.hasOne(FiscalRegistrarModel, {foreignKey: "fiscal_registrar_id"})
        ControllerModel.hasOne(BankTerminalModel, {foreignKey: "bank_terminal_id"})

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

        services.controllerService = new ControllerService({
            ControllerModel,
            ControllerStateModel,
            ControllerErrorModel,
            EquipmentModel,
            ItemMatrixModel,
            ButtonItemModel,
            equipmentService: services.equipmentService,
            fiscalRegistrarService: services.fiscalRegistrarService,
            bankTerminalService: services.bankTerminalService,
            itemMatrixService: services.itemMatrixService,
            buttonItemService: services.buttonItemService
        })

        services.saleService = new SaleService({
            SaleModel,
            controllerService: services.controllerService,
            buttonItemService: services.buttonItemService,
            itemService: services.itemService
        })

        const user = await services.userService.registerUser("test", "test")
        user.checkPermission = () => true
        await services.equipmentService.createEquipment({name: "test"}, user)

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
