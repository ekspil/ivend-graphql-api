class InvalidTimestampFormat extends Error {

    constructor() {
        super()

        this.message = "Timestamp should be an integer representing seconds passed since 1 January 1970 (UTC)"
    }
}

module.exports = InvalidTimestampFormat
