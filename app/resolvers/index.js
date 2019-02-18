const Mutations = require("./mutations")
const Queries = require("./queries")

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
        Mutation: mutations
    }
}


module.exports = Resolvers
