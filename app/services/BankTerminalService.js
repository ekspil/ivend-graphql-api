const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const BankTerminal = require("../models/BankTerminal")

class BankTerminalService {

    constructor({ BankTerminalModel }) {
        this.BankTerminal = BankTerminalModel

        this.createBankTerminal = this.createBankTerminal.bind(this)
        this.findById = this.findById.bind(this)
    }

    async createBankTerminal(createBankTerminalInput, user) {
        if (!user || !user.checkPermission(Permission.CREATE_BANK_TERMINAL)) {
            throw new NotAuthorized()
        }

        const bankTerminal = new BankTerminal()
        bankTerminal.name = createBankTerminalInput.name

        return await this.BankTerminal.create(bankTerminal)
    }

    async findById(id, user) {
        if (!user || !user.checkPermission(Permission.FIND_BANK_TERMINAL_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.BankTerminal.findOne({
            where: {
                id
            }
        })
    }

}

module.exports = BankTerminalService
