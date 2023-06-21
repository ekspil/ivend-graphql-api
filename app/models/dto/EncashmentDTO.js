class EncashmentDTO {

    constructor({id, timestamp, prevEncashment, createdAt, sum, cashless, count, countCashless, meta}) {
        this.id = id
        this.sum = sum
        this.meta = meta
        this.cashless = cashless
        this.count = count
        this.countCashless = countCashless
        this.timestamp = timestamp
        this.prevEncashment = prevEncashment ? new EncashmentDTO(prevEncashment) : null
        this.createdAt = createdAt
    }
}

module.exports = EncashmentDTO
