class ControllerDisabled extends Error {

    constructor() {
        super()

        this.message = "Controller paused or disabled"
    }
}

module.exports = ControllerDisabled
