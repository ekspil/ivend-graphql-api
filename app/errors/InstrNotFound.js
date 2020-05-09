class NewsNotFound extends Error {

    constructor() {
        super()

        this.message = "Instr not found"
    }
}

module.exports = NewsNotFound
