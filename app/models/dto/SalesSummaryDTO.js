class SalesSummaryDTO {

    constructor({id, salesCount, overallAmount, cashAmount, cashlessAmount}) {
        this.id = id
        this.salesCount = salesCount
        this.overallAmount = overallAmount
        this.cashAmount = cashAmount
        this.cashlessAmount = cashlessAmount
    }
}

module.exports = SalesSummaryDTO
