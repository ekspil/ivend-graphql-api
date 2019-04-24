class TokenNotFound extends Error {

    constructor() {
        super()

        this.message = "Token not found"
    }
}

module.exports = TokenNotFound
