const ControllerDTO = require("../../models/dto/ControllerDTO")

function ControllerQueries({controllerService}) {

    const getController = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const controller = await controllerService.getControllerById(id, user)

        if (!controller) {
            return null
        }

        return new ControllerDTO(controller)
    }

    const getControllers = async (root, args, context) => {
        const {user} = context

        const controllers = await controllerService.getAllOfCurrentUser(user)

        return controllers.map(controller => (new ControllerDTO(controller)))
    }

    const getControllerByUID = async (root, args, context) => {
        const {uid} = args
        const {user} = context

        const controller = await controllerService.getControllerByUID(uid, user)

        if (!controller) {
            return null
        }

        return new ControllerDTO(controller)

    }

    return {
        getController,
        getControllers,
        getControllerByUID
    }

}

module.exports = ControllerQueries

