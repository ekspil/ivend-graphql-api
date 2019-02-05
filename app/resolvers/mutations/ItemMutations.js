const ItemDTO = require("../../models/dto/ItemDTO")
const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")

function ItemMutations({itemService, itemMatrixService}) {

    const createItem = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const item = await itemService.createItem(input, user)

        return new ItemDTO(item)
    }


    const createItemMatrix = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const itemMatrix = await itemMatrixService.createItemMatrix(input, user)

        return new ItemMatrixDTO(itemMatrix)

    }

    return {
        createItem,
        createItemMatrix
    }

}

module.exports = ItemMutations

