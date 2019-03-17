class DepositRequestFailed extends Error {

    constructor() {
        super()

        this.message = "User not found"
    }
}

module.exports = DepositRequestFailed
