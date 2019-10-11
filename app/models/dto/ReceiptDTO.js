class ReceiptDTO {

    constructor({status, timestamp, paymentType}) {
        this.timestamp = timestamp
        this.status = status
        this.paymentType = paymentType
    }
}

module.exports = ReceiptDTO
