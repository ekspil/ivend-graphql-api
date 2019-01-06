const ControllerQueryResolver = require("./query/ControllerQueryResolver")
const ControllersQueryResolver = require("./query/ControllersQueryResolver")
const Mutations = require("./mutations")

const Resolvers = function (injects) {

    const {userService, controllerService} = injects

    const mutations = new Mutations({userService, controllerService})

    return {
        Query: {
            controller: new ControllerQueryResolver(controllerService),
            controllers: new ControllersQueryResolver(controllerService)
        },
        Mutation: mutations
    }
}


module.exports = Resolvers;
