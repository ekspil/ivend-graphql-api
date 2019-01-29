const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const BankTerminal = require("../models/BankTerminal")

class BankTerminalService {

    constructor({ bankTerminalRepository }) {
        this.bankTerminalRepository = bankTerminalRepository

        this.createBankTerminal = this.createBankTerminal.bind(this)
    }

    async createBankTerminal(createBankTerminalInput, user) {
        if (!user || !user.checkPermission(Permission.WRITE_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const bankTerminal = new BankTerminal()
        bankTerminal.name = createBankTerminalInput.name

        return await this.bankTerminalRepository.save(bankTerminal)
    }

}

module.exports = BankTerminalService
