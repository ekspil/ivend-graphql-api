

class LongTaskDTO {

    constructor({id, type, targetId, status}) {
        this.id = id
        this.type = type
        this.targetId = targetId
        this.status = status
    }
}

module.exports = LongTaskDTO
