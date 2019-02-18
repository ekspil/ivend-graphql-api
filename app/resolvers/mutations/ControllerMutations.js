const ControllerDTO = require("../../models/dto/ControllerDTO")
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

    const registerControllerError = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const controller = await controllerService.registerError(input, user)

        return new ControllerDTO(controller)
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
        const {uid} = args
        const {user} = context

        let controller = await controllerService.getControllerByUID(uid, user)

        if (!controller) {
            return null
        }

        controller = await controllerService.generateAccessKey(uid, user)

        return new ControllerDTO(controller)
    }

    const createRevision = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const revision = await revisionService.createRevision(input, user)

        return new RevisionDTO(revision)
    }

    return {
        createController,
        editController,
        authController,
        registerControllerState,
        registerControllerError,
        registerSale,
        createRevision
    }

}

module.exports = ControllerMutations

