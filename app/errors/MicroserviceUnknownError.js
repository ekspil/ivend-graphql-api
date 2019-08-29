const logger = require("my-custom-logger")

class MicroserviceUnknownError extends Error {

    /**
     *
     * @param method {string}
     * @param url {string}
     * @param statusCode {number}
     */
    constructor(method, url, statusCode) {
        super()

        logger.error("Unknown status from microservice: " + statusCode)

        this.message = "Unknown error from microservice"
    }
}

module.exports = MicroserviceUnknownError
