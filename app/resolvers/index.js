const Mutations = require("./mutations")
const Queries = require("./queries")

const Resolvers = function (injects) {

    const {
        userService, controllerService, equipmentService, fiscalRegistrarService, bankTerminalService,
        saleService, itemService, itemMatrixService
    } = injects

    const mutations = new Mutations({
        userService,
        controllerService,
        equipmentService,
        fiscalRegistrarService,
        bankTerminalService,
        saleService,
        itemService,
        itemMatrixService
    })

    const queries = new Queries({controllerService, itemMatrixService, equipmentService})

    return {
        Query: queries,
        Mutation: mutations
    }
}


module.exports = Resolvers
