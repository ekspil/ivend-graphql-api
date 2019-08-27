const logger = require("my-custom-logger")

class MicroserviceUnknownError extends Error {

    constructor(status) {
        super()

        logger.error("Unknown status from microservice: " + status)

        this.message = "Unknown error from microservice"
    }
}

module.exports = MicroserviceUnknownError
