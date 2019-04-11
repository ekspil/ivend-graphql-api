class ControllerNotFound extends Error {

    constructor() {
        super()

        this.message = "Controller not found"
    }
}

module.exports = ControllerNotFound
