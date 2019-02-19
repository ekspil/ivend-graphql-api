const Mutations = require("./mutations")
const Queries = require("./queries")
const {GraphQLScalarType, Kind} = require("graphql")

const Resolvers = function (injects) {

    const {
        userService, controllerService, equipmentService, fiscalRegistrarService, bankTerminalService,
        saleService, itemService, itemMatrixService, revisionService
    } = injects

    const mutations = new Mutations({
        userService,
        controllerService,
        equipmentService,
        fiscalRegistrarService,
        bankTerminalService,
        saleService,
        itemService,
        itemMatrixService,
        revisionService
    })

    const queries = new Queries({controllerService, itemMatrixService, equipmentService, revisionService})

    return {
        Query: queries,
        Mutation: mutations,
        Timestamp: new GraphQLScalarType({
            name: "Timestamp",
            description: "Timestamp in seconds since 1970, in UTC timezone",
            parseValue(value) {
                return new Date(value)
            },
            serialize(value) {
                return value.getTime()
            },
            parseLiteral(ast) {
                if (ast.kind === Kind.INT) {
                    return new Date(Number(ast.value)) // ast value is always in string format
                } else {
                    throw new Error("Timestamp should be an integer representing seconds passed since 1 January 1970 (UTC)")
                }
            },
        }),
    }
}


module.exports = Resolvers
