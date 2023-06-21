class Encashment {

    constructor(id, timestamp, prevEncashmentId, createdAt, sum, cashless, count, countCashless, meta) {
        this.id = id
        this.sum = sum
        this.cashless = cashless
        this.count = count
        this.countCashless = countCashless
        this.meta = meta
        this.timestamp = timestamp
        this.prevEncashmentId = prevEncashmentId
        this.createdAt = createdAt
    }

}

module.exports = Encashment
