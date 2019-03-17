class DepositRequestFailed extends Error {

    constructor() {
        super()

        this.message = "Failed to request deposit"
    }
}

module.exports = DepositRequestFailed
