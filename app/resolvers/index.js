const Mutations = require("./mutations")
const Queries = require("./queries")
const InvalidTimestampFormat = require("../errors/InvalidTimestampFormat")
const {GraphQLScalarType, Kind} = require("graphql")
const DefaultResolvers = require("./default")

const Resolvers = function (injects) {

    const {
        userService, controllerService, equipmentService,
        saleService, itemService, itemMatrixService, revisionService, notificationSettingsService,
        legalInfoService, billingService, serviceService, reportService, machineService, kktService, newsService
    } = injects

    const mutations = new Mutations({
        userService,
        controllerService,
        equipmentService,
        saleService,
        itemService,
        itemMatrixService,
        revisionService,
        notificationSettingsService,
        legalInfoService,
        billingService,
        reportService,
        machineService,
        kktService,
        newsService
    })

    const defaultResolvers = new DefaultResolvers({
        saleService,
        controllerService,
        notificationSettingsService,
        billingService,
        serviceService,
        itemService,
        machineService,
        itemMatrixService,
        kktService,
        userService
    })

    const queries = new Queries({
        controllerService,
        itemMatrixService,
        equipmentService,
        revisionService,
        userService,
        serviceService,
        machineService,
        kktService,
        newsService,
        saleService
    })

    return {
        Query: queries,
        Mutation: mutations,
        ...defaultResolvers,
        Timestamp: new GraphQLScalarType({
            name: "Timestamp",
            description: "Timestamp in milliseconds since 1970, in UTC timezone",
            parseValue(value) {
                return new Date(value)
            },
            serialize(value) {
                return value.getTime()
            },
            parseLiteral(ast) {
                if (ast.kind === Kind.INT) {
                    return new Date(Number(ast.value))
                } else {
                    throw new InvalidTimestampFormat()
                }
            },
        }),
    }
}


module.exports = Resolvers
