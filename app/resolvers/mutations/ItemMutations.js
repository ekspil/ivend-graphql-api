const ItemDTO = require("../../models/dto/ItemDTO")
const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")

function ItemMutations({itemService, itemMatrixService}) {

    const createItem = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const item = await itemService.createItem(input, user)

        return new ItemDTO(item)
    }


    const addButtonToItemMatrix = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const itemMatrix = await itemMatrixService.addButtonToItemMatrix(input, user)

        return new ItemMatrixDTO(itemMatrix)
    }
    const editButtonToItemMatrix = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const itemMatrix = await itemMatrixService.editButtonToItemMatrix(input, user)

        return new ItemMatrixDTO(itemMatrix)
    }


    const removeButtonFromItemMatrix = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const itemMatrix = await itemMatrixService.removeButtonFromItemMatrix(input, user)

        return new ItemMatrixDTO(itemMatrix)
    }

    return {
        createItem,
        addButtonToItemMatrix,
        editButtonToItemMatrix,
        removeButtonFromItemMatrix
    }

}

module.exports = ItemMutations

