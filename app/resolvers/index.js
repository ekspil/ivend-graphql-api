const Mutations = require("./mutations")
const Queries = require("./queries")

const Resolvers = function (injects) {

    const { userService, controllerService, equipmentService, fiscalRegistrarService, bankTerminalService } = injects

    const mutations = new Mutations({
        userService,
        controllerService,
        equipmentService,
        fiscalRegistrarService,
        bankTerminalService
    })

    const queries = new Queries({ controllerService })

    return {
        Query: queries,
        Mutation: mutations
    }
}


module.exports = Resolvers
