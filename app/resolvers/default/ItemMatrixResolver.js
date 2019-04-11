const ButtonItemDTO = require("../../models/dto/ButtonItemDTO")

function ItemMatrixResolver({itemMatrixService}) {

    const buttons = async (obj, args, context) => {
        const {user} = context

        const itemMatrix = await itemMatrixService.getItemMatrixById(obj.id, user)

        return itemMatrix.buttons.map(button => (new ButtonItemDTO(button)))
    }

    return {
        buttons
    }

}

module.exports = ItemMatrixResolver

