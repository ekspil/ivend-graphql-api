class ItemMatrixNotFound extends Error {

    constructor() {
        super()

        this.message = "ItemMatrix not found"
    }
}

module.exports = ItemMatrixNotFound
