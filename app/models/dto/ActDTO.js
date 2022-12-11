
class ActDTO {

    constructor({id, timestamp, meta, sum, userId}) {
        this.id = id
        this.timestamp = timestamp
        this.meta = meta
        this.sum = sum
        this.userId = userId
    }
}

module.exports = ActDTO
