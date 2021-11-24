const ItemDTO = require("./ItemDTO")
const ItemMatrixDTO = require("./ItemMatrixDTO")
const ControllerDTO = require("./ControllerDTO")

class SaleDTO {

    constructor({id, buttonId, price, type, item, itemMatrix, controller, sqr, createdAt, err, status}) {
        this.id = id
        this.buttonId = buttonId
        this.type = type
        this.price = price
        this.item = item ? new ItemDTO(item) : null
        this.itemMatrix = itemMatrix ? new ItemMatrixDTO(itemMatrix) : null
        this.controller = controller ? new ControllerDTO(controller) : null
        this.sqr = sqr
        this.status = status
        this.createdAt = createdAt
        this.err = err ? err : null
    }
}

module.exports = SaleDTO
