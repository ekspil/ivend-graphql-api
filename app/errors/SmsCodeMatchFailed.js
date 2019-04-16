class SmsCodeMatchFailed extends Error {

    constructor() {
        super()

        this.message = "SMS code does not match"
    }
}

module.exports = SmsCodeMatchFailed
