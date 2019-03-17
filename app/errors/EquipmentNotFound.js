class EquipmentNotFound extends Error {

    constructor() {
        super()

        this.message = "Equipment not found"
    }
}

module.exports = EquipmentNotFound
