const DepositDTO = require("../../models/dto/DepositDTO")

function DepositMutations({billingService}) {

    const requestDeposit = async (root, args, context) => {
        const {amount} = args
        const {user} = context

        const deposit = await billingService.requestDeposit(amount, user)

        const paymentRequest = await deposit.getPaymentRequest()

        const {status, redirectUrl} = paymentRequest
        const {id} = deposit

        return new DepositDTO({id, amount: deposit.amount, status, redirectUrl})
    }

    const removeDeposit = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const deposit = await billingService.removeDeposit(id, user)
        if(!deposit) {
            throw new Error("Not deleted")
        }
        return true
    }


    const changeUserBalance = async (root, args, context) => {
        const {id, sum} = args.input
        const {user} = context

        const balance = await billingService.changeUserBalance(id, sum, user)

        return balance
    }


    return {
        requestDeposit,
        changeUserBalance,
        removeDeposit
    }

}

module.exports = DepositMutations

