class MachineLogDTO {

    constructor({id, message, timestamp}) {
        this.id = id
        this.message = message
        this.timestamp = timestamp
    }
}

module.exports = MachineLogDTO
