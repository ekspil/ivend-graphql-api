const {ApolloServer} = require("apollo-server")
const {createConnection} = require("typeorm")
const typeDefs = require("../graphqlTypedefs")
const Resolvers = require("./resolvers")

const ControllerEntity = require("./entities/ControllerEntity")
const UserEntity = require("./entities/UserEntity")
const RoleEntity = require("./entities/RoleEntity")
const ControllerErrorEntity = require("./entities/ControllerErrorEntity")
const EquipmentEntity = require("./entities/EquipmentEntity")
const FiscalRegistrarEntity = require("./entities/FiscalRegistrarEntity")
const BankTerminalEntity = require("./entities/BankTerminalEntity")

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

const ContextResolver = require("./resolvers/ContextResolver")

const UserService = require("./services/UserService")
const ControllerService = require("./services/ControllerService")
const EquipmentService = require("./services/EquipmentService")
const FiscalRegistrarService = require("./services/FiscalRegistrarService")
const BankTerminalService = require("./services/BankTerminalService")

const logger = require("./utils/logger")

class App {

    async start() {

        const connection = await createConnection({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [ControllerEntity, UserEntity, RoleEntity, ControllerErrorEntity, EquipmentEntity, FiscalRegistrarEntity, BankTerminalEntity],
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
                CreateBankTerminal_1544941511727
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

        const userService = new UserService({
            userRepository,
            roleRepository
        })

        const controllerService = new ControllerService({
            controllerRepository,
            controllerErrorRepository
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

        const resolvers = new Resolvers({
            userService,
            controllerService,
            equipmentService,
            fiscalRegistrarService,
            bankTerminalService
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
