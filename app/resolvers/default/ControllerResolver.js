const ControllerErrorDTO = require("../../models/dto/ControllerErrorDTO")
const ServiceDTO = require("../../models/dto/ServiceDTO")
const MachineDTO = require("../../models/dto/MachineDTO")
const UserDTO = require("../../models/dto/UserDTO")
const RevisionDTO = require("../../models/dto/RevisionDTO")
const ControllerStateDTO = require("../../models/dto/ControllerStateDTO")

function ControllerResolver({controllerService, serviceService, machineService}) {

    const errors = async (obj, args, context) => {
        const {user} = context

        const controllerErrors = await controllerService.getControllerErrors(obj.id, user)

        return controllerErrors.map(controllerError => new ControllerErrorDTO(controllerError))
    }


    const lastErrorTime = async (obj, args, context) => {
        const {user} = context

        const controllerError = await controllerService.getLastControllerError(obj.id, user)

        if (!controllerError) {
            return null
        }

        return controllerError.errorTime
    }

    const services = async (obj, args, context) => {
        const {user} = context

        const services = await serviceService.getServicesForController(obj.id, user)

        return services.map(service => (new ServiceDTO(service)))
    }

    const machine = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineByControllerId(obj.id, user)

        if (!machine) {
            return null
        }

        return new MachineDTO(machine)
    }

    const lastState = async (obj, args, context) => {
        const {user} = context

        const controller = await controllerService.getControllerById(obj.id, user)

        const controllerState = await controller.getLastState()

        if (!controllerState) {
            return null
        }

        return new ControllerStateDTO(controllerState)
    }


    const user = async (obj, args, context) => {
        const {user} = context

        const controller = await controllerService.getControllerById(obj.id, user)

        const controllerUser = await controller.getUser()

        return new UserDTO(controllerUser)
    }


    const revision = async (obj, args, context) => {
        const {user} = context

        const controller = await controllerService.getControllerById(obj.id, user)

        const revision = await controller.getRevision()

        return new RevisionDTO(revision)
    }

    return {
        user,
        revision,
        lastState,
        errors,
        lastErrorTime,
        services,
        machine
    }

}

module.exports = ControllerResolver

