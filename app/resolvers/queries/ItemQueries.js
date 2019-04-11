const ItemMatrixDTO = require("../../models/dto/ItemMatrixDTO")

function ItemQueries({itemMatrixService}) {

    const getItemMatrix = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const itemMatrix = await itemMatrixService.getItemMatrixById(id, user)

        if (!itemMatrix) {
            return null
        }

        return new ItemMatrixDTO(itemMatrix)

    }

    return {
        getItemMatrix
    }

}

module.exports = ItemQueries

