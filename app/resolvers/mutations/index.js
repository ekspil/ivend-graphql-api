const ControllerMutations = require("./ControllerMutations")
const UserMutations = require("./UserMutations")

function Mutations({userService, controllerService}) {

    const userMutations = new UserMutations({userService})
    const controllerMutations = new ControllerMutations({controllerService})

    const {registerUser} = userMutations
    const {createController, addErrorToController} = controllerMutations

    return {
        registerUser,
        createController,
        addErrorToController
    }
}

module.exports = Mutations

