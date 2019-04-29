class SmsNotSent extends Error {

    constructor() {
        super()

        this.message = "Sms not sent"
    }
}

module.exports = SmsNotSent
