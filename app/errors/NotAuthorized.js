class NotAuthorized extends Error {

    constructor() {
        super()

        this.message = "Not authorized"
    }
}

module.exports = NotAuthorized
