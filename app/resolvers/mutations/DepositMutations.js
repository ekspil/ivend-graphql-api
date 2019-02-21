const DepositDTO = require("../../models/dto/DepositDTO")

function DepositMutations({depositService}) {

    const requestDeposit = async (root, args, context) => {
        const {amount} = args
        const {user} = context

        const deposit = await depositService.requestDeposit(amount, user)

        const paymentRequest = await deposit.getPaymentRequest()

        const {status, redirectUrl} = paymentRequest
        const {id} = deposit

        let mappedStatus = null

        switch (status) {
            case "pending":
                mappedStatus = "PENDING"
                break
            default:
                throw new Error("Unknown status received from payment request")
        }

        return new DepositDTO({id, amount: paymentRequest.amount, status: mappedStatus, redirectUrl})
    }


    return {
        requestDeposit
    }

}

module.exports = DepositMutations

