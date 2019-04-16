class MicroserviceUnknownError extends Error {

    constructor() {
        super()

        this.message = "Unknown error from microservice"
    }
}

module.exports = MicroserviceUnknownError
