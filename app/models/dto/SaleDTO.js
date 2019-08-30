const ItemDTO = require("./ItemDTO")
const ItemMatrixDTO = require("./ItemMatrixDTO")
const ControllerDTO = require("./ControllerDTO")

class SaleDTO {

    constructor({id, buttonId, type, item, itemMatrix, controller, sqr, createdAt}) {
        this.id = id
        this.buttonId = buttonId
        this.type = type
        this.item = item ? new ItemDTO(item) : null
        this.itemMatrix = itemMatrix ? new ItemMatrixDTO(itemMatrix) : null
        this.controller = controller ? new ControllerDTO(controller) : null
        this.sqr = sqr
        this.createdAt = createdAt
    }
}

module.exports = SaleDTO
