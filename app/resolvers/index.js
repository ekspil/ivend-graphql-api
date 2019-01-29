const ControllerQueryResolver = require("./query/ControllerQueryResolver")
const ControllersQueryResolver = require("./query/ControllersQueryResolver")
const Mutations = require("./mutations")

const Resolvers = function (injects) {

    const { userService, controllerService, equipmentService} = injects

    const mutations = new Mutations({
        userService,
        controllerService,
        equipmentService
    })

    return {
        Query: {
            controller: new ControllerQueryResolver(controllerService),
            controllers: new ControllersQueryResolver(controllerService)
        },
        Mutation: mutations
    }
}


module.exports = Resolvers
