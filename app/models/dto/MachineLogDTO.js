class MachineLogDTO {

    constructor({id, message, type, timestamp, createdAt}) {
        this.id = id
        this.message = message
        this.type = type
        this.timestamp = timestamp || createdAt
    }
}

module.exports = MachineLogDTO
