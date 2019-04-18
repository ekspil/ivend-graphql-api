class InvalidPeriod extends Error {

    constructor() {
        super()

        this.message = "Invalid period"
    }
}

module.exports = InvalidPeriod
