class DepositDTO {

    constructor({id, amount, status, redirectUrl}) {
        this.id = id
        this.amount = amount
        this.status = status
        this.redirectUrl = redirectUrl
    }
}

module.exports = DepositDTO
