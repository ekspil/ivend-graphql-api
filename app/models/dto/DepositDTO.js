class DepositDTO {

    constructor({id, amount, status, redirectUrl, timestamp, meta}) {
        this.id = id
        this.amount = amount
        this.redirectUrl = redirectUrl
        this.timestamp = timestamp
        this.status = status
        this.meta = meta
    }
}

module.exports = DepositDTO
