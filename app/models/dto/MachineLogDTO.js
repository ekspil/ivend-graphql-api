class MachineLogDTO {

    constructor({id, type, message, time}) {
        this.id = id
        this.type = type
        this.message = message
        this.time = time
    }
}

module.exports = MachineLogDTO