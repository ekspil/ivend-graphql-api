class PrintJobRequestFailed extends Error {

    constructor() {
        super()

        this.message = "Failed to send print job"
    }
}

module.exports = PrintJobRequestFailed
