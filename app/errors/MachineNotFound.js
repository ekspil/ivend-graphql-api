class MachineNotFound extends Error {

    constructor() {
        super()

        this.message = "Machine not found"
    }
}

module.exports = MachineNotFound
