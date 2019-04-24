class MachineLogDTO {

    constructor({id, message, timestamp, createdAt}) {
        this.id = id
        this.message = message
        this.timestamp = timestamp || createdAt
    }
}

module.exports = MachineLogDTO
