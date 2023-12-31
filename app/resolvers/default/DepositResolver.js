const DepositDTO = require("../../models/dto/DepositDTO")

function DepositResolver({billingService}) {


    const amount = async (obj, args, context) => {
        const {user} = context
        const {userId} = args


        const deposit = await billingService.getDepositById(obj.id, user, userId)

        return deposit.amount
    }

    const status = async (obj, args, context) => {
        const {user} = context
        const {userId} = args

        const deposit = await billingService.getDepositById(obj.id, user, userId)

        const paymentRequest = await deposit.getPaymentRequest()
        const {status} = paymentRequest

        return (new DepositDTO({status})).status
    }

    const redirectUrl = async (obj, args, context) => {
        const {user} = context
        const {userId} = args

        const deposit = await billingService.getDepositById(obj.id, user, userId)

        const paymentRequest = await deposit.getPaymentRequest()

        return paymentRequest.redirectUrl
    }

    const timestamp = async (obj, args, context) => {
        const {user} = context
        const {userId} = args

        const deposit = await billingService.getDepositById(obj.id, user, userId)

        return deposit.createdAt
    }

    return {
        amount,
        status,
        redirectUrl,
        timestamp
    }

}

module.exports = DepositResolver

