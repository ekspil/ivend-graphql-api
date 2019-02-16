const ControllerDTO = require("../../models/dto/ControllerDTO")
const SaleDTO = require("../../models/dto/SaleDTO")

function ControllerMutations({controllerService, saleService}) {

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

    return {
        createController,
        editController,
        authController,
        registerControllerState,
        registerControllerError,
        registerSale
    }

}

module.exports = ControllerMutations

