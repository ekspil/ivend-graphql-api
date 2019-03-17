class UnknownAuthenticationType extends Error {

    constructor() {
        super()

        this.message = "Unknown authentication type"
    }
}

module.exports = UnknownAuthenticationType
