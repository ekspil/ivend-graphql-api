const ControllerQueryResolver = require("./query/ControllerQueryResolver")
const ControllersQueryResolver = require("./query/ControllersQueryResolver")
const RegisterUserMutationResolver = require("./mutations/RegisterUserMutationResolver")
const CreateControllerMutationResolver = require("./mutations/CreateControllerMutationResolver")
const AuthControllerMutationResolver = require("./mutations/AuthControllerMutationResolver")

const Resolvers = function(injects) {

    const {userService, controllerService} = injects

    return {
        Query: {
            controller: new ControllerQueryResolver(controllerService),
            controllers: new ControllersQueryResolver(controllerService)
        },
        Mutation: {
            registerUser: new RegisterUserMutationResolver(userService),
            createController: new CreateControllerMutationResolver(controllerService),
            authController: new AuthControllerMutationResolver(controllerService)
        }
    }
}


module.exports = Resolvers;
