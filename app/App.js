const {ApolloServer} = require('apollo-server');
const {createConnection} = require("typeorm")
const typeDefs = require("../graphqlTypedefs")
const resolvers = require("./resolvers")
const mongoose = require("mongoose")

const ControllerEntity = require("./entities/ControllerEntity")
const UserEntity = require("./entities/UserEntity")

const CreateController_1544871592978 = require("./migrations/CreateController_1544871592978")
const CreateUser_1544875175234 = require("./migrations/CreateUser_1544875175234")

class App {

    async start() {

        await createConnection({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [ControllerEntity, UserEntity],
            synchronize: false,
            logging: process.env.NODE_ENV !== 'production',
            migrations: [CreateController_1544871592978, CreateUser_1544875175234],
            migrationsRun: true,
            cli: {
                migrationsDir: "migrations"
            }
        })

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            introspection: true,
            playground: true
        });

        server.listen().then(({url}) => {
            console.log(`GraphQL Server ready at ${url}`);
        });
    }
}


module.exports = App
