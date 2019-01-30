const ControllerDTO = require("../../models/dto/ControllerDTO")

function ControllerQueries({ controllerService }) {

    const getController = async (root, args, context) => {
        const { id } = args
        const { user } = context

        const controller = await controllerService.getControllerById(id, user)

        return new ControllerDTO(controller)
    }

    const getControllers = async (root, args, context) => {
        const { user } = context

        const controllers = await controllerService.getAll(user)

        return controllers.map(controller => (new ControllerDTO(controller)))
    }

    return {
        getController,
        getControllers
    }

}

module.exports = ControllerQueries

