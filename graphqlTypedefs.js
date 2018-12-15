const {gql} = require('apollo-server');

const typeDefs = gql`
    type Controller {
        uid: String
        mode: String
        accessKey: String
    }
    
    type User {
        email: String!,
        phone: String
    }

    type Query {
        controller(uid: String!): Controller
    }

    type Mutation {
        registerUser(email: String!, password: String!): User
    }
    
`;

module.exports = typeDefs
