const DepositDTO = require("./DepositDTO")

class BillingDTO {

    constructor({balance, deposits, dailyBill, daysLeft}) {
        this.balance = balance
        this.deposits = deposits ? deposits.map(deposit => (new DepositDTO(deposit))) : null
        this.dailyBill = dailyBill
        this.daysLeft = daysLeft
    }
}

module.exports = BillingDTO
