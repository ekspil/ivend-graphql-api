
class BankPaymentDTO {

    constructor({id, applied,  startedAt, meta, userId, createdAt, userName, userInn, amount, type}) {
        this.id = id
        this.applied = applied
        this.meta = meta
        this.userId = userId
        this.startedAt = startedAt
        this.createdAt = createdAt
        this.userName = userName
        this.userInn = userInn
        this.amount = amount
        this.type = type
    }
}

module.exports = BankPaymentDTO
