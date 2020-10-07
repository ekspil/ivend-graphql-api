class EncashmentDTO {

    constructor({id, timestamp, prevEncashment, createdAt, sum}) {
        this.id = id
        this.sum = sum
        this.timestamp = timestamp
        this.prevEncashment = prevEncashment ? new EncashmentDTO(prevEncashment) : null
        this.createdAt = createdAt
    }
}

module.exports = EncashmentDTO
