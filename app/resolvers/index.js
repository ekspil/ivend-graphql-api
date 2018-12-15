const ControllerQueryResolver = require("./query/ControllerQueryResolver")
const RegisterUserMutationResolver = require("./mutations/RegisterUserMutationResolver")

const Resolvers = function(injects) {

    const {userService, controllerService} = injects

    return {
        Query: {
            controller: new ControllerQueryResolver(controllerService)
        },
        Mutation: {
            registerUser: new RegisterUserMutationResolver(userService)
        }
    }
}


module.exports = Resolvers;
