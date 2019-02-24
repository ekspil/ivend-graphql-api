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


    return {
        requestDeposit
    }

}

module.exports = DepositMutations

