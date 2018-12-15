const {gql} = require('apollo-server');

const typeDefs = gql`
    type Controller {
        uid: String!
        mode: String!
    }

    type User {
        email: String!,
        phone: String
    }

    type Query {
        controller(uid: String!): Controller
        controllers: [Controller]
    }

    type Mutation {
        registerUser(email: String!, password: String!): User
        createController(uid:String!, mode: String!): Controller
    }

`;

module.exports = typeDefs
