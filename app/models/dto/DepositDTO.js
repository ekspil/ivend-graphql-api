class DepositDTO {

    constructor({id, amount, status, redirectUrl, timestamp}) {
        this.id = id
        this.amount = amount
        this.redirectUrl = redirectUrl
        this.timestamp = timestamp
        this.status = status
    }
}

module.exports = DepositDTO
