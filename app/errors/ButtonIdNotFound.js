class ButtonIdNotFound extends Error {

    constructor() {
        super()

        this.message = "No such buttonId in this ItemMatrix"
    }
}

module.exports = ButtonIdNotFound
