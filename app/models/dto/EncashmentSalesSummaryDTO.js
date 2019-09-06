const EncashmentDTO = require("./EncashmentDTO")
const SalesSummaryDTO = require("./SalesSummaryDTO")

class EncashmentSalesSummaryDTO {

    constructor({encashment, salesSummary}) {
        this.encashment = encashment ? new EncashmentDTO(encashment) : null
        this.salesSummary = salesSummary ? new SalesSummaryDTO(salesSummary) : null
    }
}

module.exports = EncashmentSalesSummaryDTO
