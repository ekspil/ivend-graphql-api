const {gql} = require('apollo-server');

const typeDefs = gql`
    type Controller {
        uid: String!
        mode: String!
    }
    
    type ControllerError {
        id: Int
        message: String
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
        authController(uid:String!): String
        addErrorToController(uid:String!, message: String!): ControllerError
    }

`;

module.exports = typeDefs
