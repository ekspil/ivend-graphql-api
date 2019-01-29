const BankTerminalDTO = require("../../models/dto/BankTerminalDTO")

function BankTerminalMutations({bankTerminalService}) {

    const createBankTerminal = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const equipment = await bankTerminalService.createBankTerminal(input, user)

        return new BankTerminalDTO(equipment)
    }

    return {
        createBankTerminal
    }

}

module.exports = BankTerminalMutations

