const ControllerDTO = require("../../models/dto/ControllerDTO")

function ControllerMutations({controllerService}) {

    const createController = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.createController(input, user)

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


    const authController = async (root, args, context) => {
        const {uid} = args
        const {user} = context

        return await controllerService.generateAccessKey(uid, user)

    }

    return {
        createController,
        addErrorToController,
        authController
    }

}

module.exports = ControllerMutations

