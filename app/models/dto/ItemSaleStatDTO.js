const ItemDTO = require("./ItemDTO")

class ItemSaleStatDTO {

    constructor({item, amount}) {
        this.item = item ? new ItemDTO(item) : null
        this.amount = amount
    }
}

module.exports = ItemSaleStatDTO
