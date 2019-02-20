const ItemDTO = require("./ItemDTO")

class ItemSaleStatDTO {

    constructor({item, salesSummary}) {
        this.item = item ? new ItemDTO(item) : null
        this.salesSummary = salesSummary
    }
}

module.exports = ItemSaleStatDTO
