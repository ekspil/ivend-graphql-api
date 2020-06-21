class ControllerNotFound extends Error {

    constructor() {
        super()

        this.message = "Send sms failed"
    }
}

module.exports = ControllerNotFound
