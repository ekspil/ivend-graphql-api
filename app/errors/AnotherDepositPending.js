class AnotherDepositPending extends Error {

    constructor() {
        super()

        this.message = "Another deposit already in process"
    }
}

module.exports = AnotherDepositPending
