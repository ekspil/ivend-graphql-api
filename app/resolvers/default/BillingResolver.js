const DepositDTO = require("../../models/dto/DepositDTO")

function BillingResolver({billingService}) {


    const balance = async (obj, args, context) => {
        const {user} = context
        const {userId} = args
        if(userId){
            return await billingService.getBalance(user, userId)
        }
        return await billingService.getBalance(user, obj.userId)
    }

    const deposits = async (obj, args, context) => {
        const {user} = context
        const {period, userId} = args

        const deposits = await billingService.getDeposits(period, user, null, userId)

        return deposits.map(deposit => (new DepositDTO({
            id: deposit.id,
            amount: deposit.amount,
            status: deposit.paymentRequest.status,
            redirectUrl: deposit.paymentRequest.redirectUrl,
            timestamp: deposit.paymentRequest.createdAt,
            meta: deposit.paymentRequest.paymentId
        })))
    }

    const dailyBill = async (obj, args, context) => {
        const {user} = context

        const {userId} = args
        if(userId){
            return await billingService.getDailyBill(user, userId)
        }

        return await billingService.getDailyBill(user, obj.userId)
    }

    const daysLeft = async (obj, args, context) => {
        const {user} = context
        const {userId} = args
        if(userId){
            return await billingService.getDaysLeft(user, userId)
        }
        return await billingService.getDaysLeft(user, obj.userId)
    }

    return {
        balance,
        deposits,
        dailyBill,
        daysLeft
    }

}

module.exports = BillingResolver

