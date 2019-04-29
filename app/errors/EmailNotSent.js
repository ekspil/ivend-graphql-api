class EmailNotSent extends Error {

    constructor() {
        super()

        this.message = "Email not sent"
    }
}

module.exports = EmailNotSent
