const ControllerDTO = require("../../models/dto/ControllerDTO")
const ControllerPulseDTO = require("../../models/dto/ControllerPulseDTO")
const ControllerErrorDTO = require("../../models/dto/ControllerErrorDTO")
const RevisionDTO = require("../../models/dto/RevisionDTO")
const SaleDTO = require("../../models/dto/SaleDTO")

function ControllerMutations({controllerService, saleService, revisionService}) {

    const createController = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.createController(input, user)

        return new ControllerDTO(controller)
    }

    const getCubeToken = async (root, args, context) => {
        const {user} = context

        const token = await controllerService.getCubeToken(user)

        return token
    }

    const setControllerPulse = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const pulse = await controllerService.setControllerPulse(input, user)

        return new ControllerPulseDTO(pulse)
    }


    const editController = async (root, args, context) => {
        const {id, input} = args
        const {user} = context

        const controller = await controllerService.editController(id, input, user)

        return new ControllerDTO(controller)
    }



    const editControllerGroupSettings = async (root, args, context) => {
        const {id, input} = args
        const {user} = context

        await controllerService.editControllerGroupSettings(id, input, user)

        return true
    }


    const updatePrinterOnController = async (root, args, context) => {
        const {input} = args
        const {user} = context

        return await controllerService.updatePrinterOnController(input, user)

    }

    const deleteController = async (root, args, context) => {
        const {id} = args
        const {user} = context

        return await controllerService.deleteController(id, user)
    }

    const registerControllerError = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controllerError = await controllerService.registerError(input, user)

        return new ControllerErrorDTO(controllerError)
    }

    const registerControllerState = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.registerState(input, user, input.data)

        return new ControllerDTO(controller)
    }

    const registerSale = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const sale = await saleService.registerSale(input, user)

        return new SaleDTO(sale)
    }

    const authController = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.authController(input, user)

        return new ControllerDTO(controller)
    }

    const createRevision = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const revision = await revisionService.createRevision(input, user)

        return new RevisionDTO(revision)
    }

    const registerEvent = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.registerEvent(input, user)

        return new ControllerDTO(controller)
    }

    const reSendCheck = async (root, args, context) => {
        const {id} = args
        const {user} = context

        return await saleService.reSendCheck(id, user)

    }

    const simReset = async (root, args, context) => {
        const {sim} = args
        const {user} = context

        return await controllerService.simReset(sim, user)

    }

    const updateControllerIntegration = async (root, args, context) => {
        const {input} = args
        const {user} = context

        return await controllerService.updateControllerIntegration(user, input)

    }

    const telemetronEvent = async (root, args, context) => {
        const {input} = args
        const {user} = context

        return await controllerService.telemetronEvent(input, user)

    }

    const updateCubeStatus = async (root, args, context) => {
        const {input} = args
        const {user} = context

        return await controllerService.updateCubeStatus(input, user)

    }

    return {
        createController,
        editController,
        deleteController,
        authController,
        registerControllerState,
        registerControllerError,
        registerSale,
        createRevision,
        registerEvent,
        updatePrinterOnController,
        editControllerGroupSettings,
        reSendCheck,
        simReset,
        updateControllerIntegration,
        telemetronEvent,
        setControllerPulse,
        getCubeToken,
        updateCubeStatus
    }

}

module.exports = ControllerMutations

