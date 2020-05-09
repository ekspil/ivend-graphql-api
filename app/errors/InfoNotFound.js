class NewsNotFound extends Error {

    constructor() {
        super()

        this.message = "Info not found"
    }
}

module.exports = NewsNotFound
