const {ApolloServer} = require("apollo-server")
const {createConnection} = require("typeorm")
const typeDefs = require("../graphqlTypedefs")
const Resolvers = require("./resolvers")
const Sequelize = require("sequelize")

const ControllerEntity = require("./entities/ControllerEntity")
const UserEntity = require("./entities/UserEntity")
const RoleEntity = require("./entities/RoleEntity")
const ControllerErrorEntity = require("./entities/ControllerErrorEntity")
const EquipmentEntity = require("./entities/EquipmentEntity")
const FiscalRegistrarEntity = require("./entities/FiscalRegistrarEntity")
const BankTerminalEntity = require("./entities/BankTerminalEntity")
const ControllerStateEntity = require("./entities/ControllerStateEntity")
const ItemEntity = require("./entities/ItemEntity")
const ItemMatrixEntity = require("./entities/ItemMatrixEntity")
const SaleEntity = require("./entities/SaleEntity")
const ButtonItemEntity = require("./entities/ButtonItemEntity")

const CreateController_1544871592978 = require("./migrations/CreateController_1544871592978")
const CreateUser_1544875175234 = require("./migrations/CreateUser_1544875175234")
const CreateRoles_1544941386216 = require("./migrations/CreateRoles_1544941386216")
const AddDefaultRoles_1544941511727 = require("./migrations/AddDefaultRoles_1544941511727")
const AddRoleColumnToUser_1544941511727 = require("./migrations/AddRoleColumnToUser_1544941511727")
const CreateControllerErrors_1546796166078 = require("./migrations/CreateControllerErrors_1546796166078")
const AddUserColumnToController_1546799900517 = require("./migrations/AddUserColumnToController_1546799900517")
const CreateEquipment_1548762321802 = require("./migrations/CreateEquipment_1548762321802")
const CreateFiscalRegistrar_1548765405824 = require("./migrations/CreateFiscalRegistrar_1548765405824")
const CreateBankTerminal_1544941511727 = require("./migrations/CreateBankTerminal_1544941511727")
const AddMoreColumnsToController_1548773174036 = require("./migrations/AddMoreColumnsToController_1548773174036")
const CreateControllerStates_1548951696291 = require("./migrations/CreateControllerStates_1548951696291")
const CreateItem_1549024284721 = require("./migrations/CreateItem_1549024284721")
const CreateItemMatrix_1549024960721 = require("./migrations/CreateItemMatrix_1549024960721")
const CreateSale_1549025045086 = require("./migrations/CreateSale_1549025045086")
const CreateButtonItems_1549193067979 = require("./migrations/CreateButtonItems_1549193067979")
const AddItemMatrixToController_1549371997460 = require("./migrations/AddItemMatrixToController_1549371997460")

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

        const sequelize = new Sequelize(`${process.env.POSTGRES_DB}_seq`, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
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

        ItemModel.belongsTo(UserModel, {foreignKey: "user_id"})

        SaleModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})
        SaleModel.belongsTo(ItemModel, {foreignKey: "item_id"})
        SaleModel.belongsTo(ItemMatrixModel, {foreignKey: "item_matrix_id"})

        ButtonItemModel.belongsTo(ItemModel, {foreignKey: "item_id"})
        ButtonItemModel.belongsTo(ItemMatrixModel, {foreignKey: "item_matrix_id"})

        ItemMatrixModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ItemMatrixModel.hasMany(ButtonItemModel, {foreignKey: "item_matrix_id"})

        ControllerErrorModel.belongsTo(ControllerModel, {foreignKey: "controller_id"})

        ControllerModel.belongsTo(UserModel, {foreignKey: "user_id"})
        ControllerModel.belongsTo(ControllerStateModel, {foreignKey: "last_state_id"})
        ControllerModel.belongsTo(EquipmentModel, {foreignKey: "equipment_id"})
        ControllerModel.belongsTo(ItemMatrixModel, {foreignKey: "item_matrix_id"})
        ControllerModel.belongsTo(FiscalRegistrarModel, {foreignKey: "fiscal_registrar_id"})
        ControllerModel.belongsTo(BankTerminalModel, {foreignKey: "bank_terminal_id"})

        await sequelize.authenticate()
        await sequelize.sync({force: true})

        const connection = await createConnection({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [
                ControllerEntity,
                UserEntity,
                RoleEntity,
                ControllerErrorEntity,
                EquipmentEntity,
                FiscalRegistrarEntity,
                BankTerminalEntity,
                ControllerStateEntity,
                ItemEntity,
                ItemMatrixEntity,
                SaleEntity,
                ButtonItemEntity
            ],
            synchronize: false,
            logging: process.env.NODE_ENV !== "production",
            migrations: [
                CreateController_1544871592978,
                CreateUser_1544875175234,
                CreateRoles_1544941386216,
                AddDefaultRoles_1544941511727,
                AddRoleColumnToUser_1544941511727,
                CreateControllerErrors_1546796166078,
                AddUserColumnToController_1546799900517,
                CreateEquipment_1548762321802,
                CreateFiscalRegistrar_1548765405824,
                CreateBankTerminal_1544941511727,
                AddMoreColumnsToController_1548773174036,
                CreateControllerStates_1548951696291,
                CreateItem_1549024284721,
                CreateItemMatrix_1549024960721,
                CreateSale_1549025045086,
                CreateButtonItems_1549193067979,
                AddItemMatrixToController_1549371997460
            ],
            migrationsRun: true,
            cli: {
                migrationsDir: "migrations"
            }
        })

        const userRepository = connection.getRepository(UserEntity)
        const controllerRepository = connection.getRepository(ControllerEntity)
        const controllerErrorRepository = connection.getRepository(ControllerErrorEntity)
        const roleRepository = connection.getRepository(RoleEntity)
        const equipmentRepository = connection.getRepository(EquipmentEntity)
        const fiscalRegistrarRepository = connection.getRepository(FiscalRegistrarEntity)
        const bankTerminalRepository = connection.getRepository(BankTerminalEntity)
        const controllerStateRepository = connection.getRepository(ControllerStateEntity)
        const saleRepository = connection.getRepository(SaleEntity)
        const itemRepository = connection.getRepository(ItemEntity)
        const itemMatrixRepository = connection.getRepository(ItemMatrixEntity)
        const buttonItemRepository = connection.getRepository(ButtonItemEntity)

        const userService = new UserService({
            userRepository,
            roleRepository
        })

        const equipmentService = new EquipmentService({
            equipmentRepository
        })

        const fiscalRegistrarService = new FiscalRegistrarService({
            fiscalRegistrarRepository
        })

        const bankTerminalService = new BankTerminalService({
            bankTerminalRepository
        })


        const itemService = new ItemService({itemRepository})

        const buttonItemService = new ButtonItemService({buttonItemRepository, itemRepository, itemMatrixRepository})

        const itemMatrixService = new ItemMatrixService({itemMatrixRepository, itemService, buttonItemService})

        const controllerService = new ControllerService({
            controllerRepository,
            controllerStateRepository,
            controllerErrorRepository,
            equipmentService,
            fiscalRegistrarService,
            bankTerminalService,
            itemMatrixService,
            buttonItemService
        })

        const saleService = new SaleService({saleRepository, controllerService, buttonItemService, itemService})

        const resolvers = new Resolvers({
            userService,
            controllerService,
            equipmentService,
            fiscalRegistrarService,
            bankTerminalService,
            saleService,
            itemService,
            itemMatrixService
        })

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: new ContextResolver(userRepository),
            introspection: true,
            playground: true
        })

        const serverInfo = await server.listen()

        logger.info(`GraphQL Server ready at ${serverInfo.url}`)

    }
}


module.exports = App
