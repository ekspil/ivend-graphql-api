class BankTerminalNotFound extends Error {

    constructor() {
        super()

        this.message = "BankTerminal not found"
    }
}

module.exports = BankTerminalNotFound
