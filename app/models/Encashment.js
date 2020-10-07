class Encashment {

    constructor(id, timestamp, prevEncashmentId, createdAt, sum) {
        this.id = id
        this.sum = sum
        this.timestamp = timestamp
        this.prevEncashmentId = prevEncashmentId
        this.createdAt = createdAt
    }

}

module.exports = Encashment
