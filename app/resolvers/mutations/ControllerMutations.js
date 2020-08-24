const ControllerDTO = require("../../models/dto/ControllerDTO")
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


    const editController = async (root, args, context) => {
        const {id, input} = args
        const {user} = context

        const controller = await controllerService.editController(id, input, user)

        return new ControllerDTO(controller)
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

        const controller = await controllerService.registerState(input, user)

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
        updatePrinterOnController
    }

}

module.exports = ControllerMutations

