class MicroserviceUnknownError extends Error {

    constructor(status) {
        super()

        console.error("Unknown status from microservice: " + status)

        this.message = "Unknown error from microservice"
    }
}

module.exports = MicroserviceUnknownError
