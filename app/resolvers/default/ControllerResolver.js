const ControllerErrorDTO = require("../../models/dto/ControllerErrorDTO")
const MachineDTO = require("../../models/dto/MachineDTO")
const ServiceDTO = require("../../models/dto/ServiceDTO")
const UserDTO = require("../../models/dto/UserDTO")
const RevisionDTO = require("../../models/dto/RevisionDTO")
const ControllerStateDTO = require("../../models/dto/ControllerStateDTO")
const ControllerPulseDTO = require("../../models/dto/ControllerPulseDTO")

function ControllerResolver({controllerService, machineService}) {

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

    const pulse = async (obj, args, context) => {
        const {user} = context


        if(obj.mode !== "ps_m_D"){
            return null
        }

        const controllerPulse = await controllerService.getControllerPulse(obj.id, user)

        if (!controllerPulse) {
            return null
        }
        if(!Number(controllerPulse.a) && !Number(controllerPulse.b) && !Number(controllerPulse.c) && !Number(controllerPulse.o) && !Number(controllerPulse.t)){
            return null
        }

        return new ControllerPulseDTO(controllerPulse)
    }


    const mech = async (obj, args, context) => {
        const {user} = context

        if(obj.mode !== "mech"){
            return null
        }

        const controllerPulse = await controllerService.getControllerPulse(obj.id, user)

        if (!controllerPulse) {
            return null
        }

        if(!Number(controllerPulse.a) && !Number(controllerPulse.b) && !Number(controllerPulse.c) && !Number(controllerPulse.o) && !Number(controllerPulse.t) && !Number(controllerPulse.d) && !Number(controllerPulse.e) && !Number(controllerPulse.f)){
            return null
        }

        return new ControllerPulseDTO(controllerPulse)
    }

    const cmd = async (obj, args, context) => {
        const {user} = context
        const command = await controllerService.getControllerCommand(obj.id, user)

        if (!command) {
            return null
        }

        return command
    }

    const machine = async (obj, args, context) => {
        const {user} = context
        const machine = await machineService.getMachineByControllerId(obj.id, user)

        if (!machine) {
            return null
        }

        return new MachineDTO(machine)
    }

    const services = async (obj, args, context) => {
        const {user} = context

        const servs = await controllerService.getControllerServices(obj.id, user)

        if (!servs) {
            return null
        }

        return servs.map(sr => new ServiceDTO(sr))
    }

    const lastState = async (obj, args, context) => {
        const {user} = context

        const controllerState = await controllerService.lastState(obj.id, user)

        //const controllerState = await controller.getLastState()

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
        machine,
        services,
        pulse,
        mech,
        cmd
    }

}

module.exports = ControllerResolver

