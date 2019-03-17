class ServiceNotFound extends Error {

    constructor() {
        super()

        this.message = "Service not found"
    }
}

module.exports = ServiceNotFound
