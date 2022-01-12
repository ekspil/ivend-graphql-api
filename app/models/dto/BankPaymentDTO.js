
class BankPaymentDTO {

    constructor({id, applied,  startedAt, meta, userId, createdAt}) {
        this.id = id
        this.applied = applied
        this.meta = meta
        this.userId = userId
        this.startedAt = startedAt
        this.createdAt = createdAt
    }
}

module.exports = BankPaymentDTO
