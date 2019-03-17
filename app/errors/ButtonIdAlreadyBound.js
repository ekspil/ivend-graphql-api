class ButtonIdAlreadyBound extends Error {

    constructor() {
        super()

        this.message = "Such buttonId already bound to this ItemMatrix"
    }
}

module.exports = ButtonIdAlreadyBound
