const DepositDTO = require("../../models/dto/DepositDTO")

function BillingResolver({billingService}) {


    const balance = async (obj, args, context) => {
        const {user} = context
        return await billingService.getBalance(user)
    }

    const deposits = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const deposits = await billingService.getDeposits(period, user)

        return deposits.map(deposit => (new DepositDTO({
            id: deposit.id,
            amount: deposit.amount,
            status: deposit.paymentRequest.status,
            redirectUrl: deposit.paymentRequest.redirectUrl,
            timestamp: deposit.paymentRequest.createdAt
        })))
    }

    const dailyBill = async (obj, args, context) => {
        const {user} = context

        return await billingService.getDailyBill(user)
    }

    const daysLeft = async (obj, args, context) => {
        const {user} = context

        return await billingService.getDaysLeft(user)
    }

    return {
        balance,
        deposits,
        dailyBill,
        daysLeft
    }

}

module.exports = BillingResolver

