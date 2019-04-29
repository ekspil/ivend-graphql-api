class ControllerUIDConflict extends Error {

    constructor() {
        super()

        this.message = "Controller with such UID exist"
    }
}

module.exports = ControllerUIDConflict
