const DepositDTO = require("./DepositDTO")

class BillingDTO {

    constructor({balance, deposits, dailyBill, daysLeft, userId}) {
        this.balance = balance
        this.deposits = deposits ? deposits.map(deposit => (new DepositDTO(deposit))) : null
        this.dailyBill = dailyBill
        this.daysLeft = daysLeft
        this.userId = userId
    }
}

module.exports = BillingDTO
