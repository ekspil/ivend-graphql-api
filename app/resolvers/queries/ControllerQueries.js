const ControllerDTO = require("../../models/dto/ControllerDTO")
const RevisionDTO = require("../../models/dto/RevisionDTO")

function ControllerQueries({controllerService, revisionService}) {

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



    const getAllControllers = async (root, args, context) => {
        const {user} = context
        const {offset, limit, status, connection, terminal, fiscalizationMode, bankTerminalMode, printer, registrationTime, terminalStatus, orderDesc, orderKey, userRole} = args

        const controllers = await controllerService.getAll(offset, limit, status, connection, terminal, fiscalizationMode, bankTerminalMode, printer, registrationTime, terminalStatus, orderDesc, orderKey, userRole, user)

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

    const getRevisions = async (root, args, context) => {
        const {user} = context

        const revisions = await revisionService.getAll(user)

        return revisions.map(revision => (new RevisionDTO(revision)))
    }

    return {
        getController,
        getControllers,
        getControllerByUID,
        getRevisions,
        getAllControllers
    }

}

module.exports = ControllerQueries

