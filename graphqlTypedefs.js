const {gql} = require('apollo-server');

const typeDefs = gql`
    type Controller {
        uid: String
        mode: String
        accessKey: String
    }

    type Query {
        controller(uid: String!): Controller
    }
`;

module.exports = typeDefs
