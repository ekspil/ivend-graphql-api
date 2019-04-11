class MachineGroupNotFound extends Error {

    constructor() {
        super()

        this.message = "MachineGroup not found"
    }
}

module.exports = MachineGroupNotFound
