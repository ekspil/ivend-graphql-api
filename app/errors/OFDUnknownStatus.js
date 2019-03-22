class OFDUnknownStatus extends Error {

    constructor() {
        super()

        this.message = "Not authorized"
    }
}

module.exports = OFDUnknownStatus
