class SmsCodeTimeout extends Error {

    constructor() {
        super()

        this.message = "SMS code timed out"
    }
}

module.exports = SmsCodeTimeout
