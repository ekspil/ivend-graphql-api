class EncashmentDTO {

    constructor({id, timestamp, prevEncashment, createdAt}) {
        this.id = id
        this.timestamp = timestamp
        this.prevEncashment = prevEncashment ? new EncashmentDTO(prevEncashment) : null
        this.createdAt = createdAt
    }
}

module.exports = EncashmentDTO
