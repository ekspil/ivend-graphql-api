const ItemDTO = require("../../models/dto/ItemDTO")
const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")

function ItemMutations({itemService, itemMatrixService, controllerService}) {

    const createItem = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const item = await itemService.createItem(input, user)

        return new ItemDTO(item)
    }


    const createItemMatrix = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const {controllerId} = input

        const controller = await controllerService.getControllerById(controllerId, user)

        const itemMatrix = await itemMatrixService.createItemMatrix(input, controller, user)

        return new ItemMatrixDTO(itemMatrix)

    }
    const createItemInItemMatrix = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const result = await itemMatrixService.createItemInItemMatrix(input, user)

        return new ItemMatrixDTO(result)

    }



    return {
        createItem,
        createItemMatrix,
        createItemInItemMatrix
    }

}

module.exports = ItemMutations

