const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")

function ItemQueries({itemMatrixService}) {

    const getItemMatrix = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const itemMatrix = await itemMatrixService.getItemMatrixById(id, user)

        return new ItemMatrixDTO(itemMatrix)

    }

    return {
        getItemMatrix
    }

}

module.exports = ItemQueries

