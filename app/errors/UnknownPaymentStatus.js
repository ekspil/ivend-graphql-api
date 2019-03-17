class UnknownPaymentStatus extends Error {

    constructor() {
        super()

        this.message = "Unknown Payment Status"
    }
}

module.exports = UnknownPaymentStatus
