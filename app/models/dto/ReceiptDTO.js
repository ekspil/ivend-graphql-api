class ReceiptDTO {

    constructor({status, timestamp, paymentType, id}) {
        this.timestamp = timestamp
        this.status = status
        this.paymentType = paymentType
        this.id = id
    }
}

module.exports = ReceiptDTO
