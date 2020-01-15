class NewsNotFound extends Error {

    constructor() {
        super()

        this.message = "News not found"
    }
}

module.exports = NewsNotFound
