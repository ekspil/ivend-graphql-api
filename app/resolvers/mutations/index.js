const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")

function Mutations({userService, controllerService}) {

    const userMutations = new UserMutations({userService})
    const controllerMutations = new ControllerMutations({controllerService})


    return {
        ...userMutations,
        ...controllerMutations
    }
}

module.exports = Mutations

