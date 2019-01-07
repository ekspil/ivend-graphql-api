function ControllerMutations({controllerService}) {

    const createController = async (root, args, context) => {
        const {uid, mode} = args;
        const {user} = context

        const controller = await controllerService.createController(uid, mode, user)

        return {
            uid: controller.uid,
            mode: controller.mode
        }

    }

    const addErrorToController = async (root, args, context) => {
        const {uid, message} = args;
        const {user} = context

        const controllerError = await controllerService.addErrorToController(uid, message, user)

        return {
            id: controllerError.id,
            message: controllerError.message
        }

    }


    const authController = async (root, args, context) => {
        const {uid} = args;
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

