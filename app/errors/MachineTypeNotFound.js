class MachineTypeNotFound extends Error {

    constructor() {
        super()

        this.message = "MachineType not found"
    }
}

module.exports = MachineTypeNotFound
