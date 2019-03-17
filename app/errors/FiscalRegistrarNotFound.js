class FiscalRegistrarNotFound extends Error {

    constructor() {
        super()

        this.message = "FiscalRegistrar not found"
    }
}

module.exports = FiscalRegistrarNotFound
