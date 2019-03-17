class ItemNotFound extends Error {

    constructor() {
        super()

        this.message = "Item not found"
    }
}

module.exports = ItemNotFound
