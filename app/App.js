const {ApolloServer} = require('apollo-server');
const typeDefs = require("../graphqlTypedefs")
const resolvers = require("./resolvers")
const mongoose = require("mongoose")

class App {

    async start() {
        try {
            await mongoose.connect(process.env.MONGODB_URL)
        } catch (e) {
            console.error(e)
            console.error(e.stack)
            throw e
        }


        // In the most basic sense, the ApolloServer can be started
        // by passing type definitions (typeDefs) and the resolvers
        // responsible for fetching the data for those types.
        const server = new ApolloServer({
            typeDefs, resolvers,
            introspection: true
        });

        // This `listen` method launches a web-server.  Existing apps
        // can utilize middleware options, which we'll discuss later.
        server.listen().then(({url}) => {
            console.log(`Server ready at ${url}`);
        });
    }
}


module.exports = App