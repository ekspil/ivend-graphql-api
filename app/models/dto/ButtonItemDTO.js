const ItemDTO = require("./ItemDTO")
const ItemMatrixDTO = require("./ItemMatrixDTO")

class ButtonItemDTO {

    constructor({id, item, itemMatrix, buttonId, multiplier}) {
        this.id = id
        this.multiplier = multiplier
        this.buttonId = buttonId
        this.item = item ? new ItemDTO(item) : null
        this.itemMatrix = itemMatrix ? new ItemMatrixDTO(itemMatrix) : null
    }
}

module.exports = ButtonItemDTO
