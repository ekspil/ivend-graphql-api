class KktNotFound extends Error {

    constructor() {
        super()

        this.message = "Kkt not found"
    }
}

module.exports = KktNotFound
