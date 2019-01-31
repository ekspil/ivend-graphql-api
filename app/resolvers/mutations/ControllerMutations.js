const ControllerDTO = require("../../models/dto/ControllerDTO")

function ControllerMutations({controllerService}) {

    const createController = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.createController(input, user)

        return new ControllerDTO(controller)

    }

    const editController = async (root, args, context) => {
        const {id, input} = args
        const {user} = context

        const controller = await controllerService.editController(id, input, user)

        return new ControllerDTO(controller)

    }


    const addErrorToController = async (root, args, context) => {
        const {uid, message} = args
        const {user} = context

        const controllerError = await controllerService.addErrorToController(uid, message, user)

        return {
            id: controllerError.id,
            message: controllerError.message
        }

    }
    const registerControllerState = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.registerState(input, user)

        return new ControllerDTO(controller)

    }

    const authController = async (root, args, context) => {
        const {uid} = args
        const {user} = context

        let controller = await controllerService.getControllerByUID(uid, user)

        if (!controller) {
            return null
        }

        controller = await controllerService.generateAccessKey(uid, user)

        return new ControllerDTO(controller)

    }

    return {
        createController,
        editController,
        addErrorToController,
        authController,
        registerControllerState
    }

}

module.exports = ControllerMutations

