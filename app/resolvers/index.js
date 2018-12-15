const ControllerQueryResolver = require("./query/ControllerQueryResolver")
const RegisterUserMutationResolver = require("./mutations/RegisterUserMutationResolver")

const Resolvers = function(injects) {

    const {userService} = injects

    return {
        Query: {
            controller: new ControllerQueryResolver()
        },
        Mutation: {
            registerUser: new RegisterUserMutationResolver(userService)
        }
    }
}


module.exports = Resolvers;
