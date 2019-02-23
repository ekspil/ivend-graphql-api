const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")


class BillingService {

    constructor({TransactionModel, DepositModel, PaymentRequestModel}) {
        this.Transaction = TransactionModel
        this.Deposit = DepositModel
        this.PaymentRequest = PaymentRequestModel

        this.getBalance = this.getBalance.bind(this)
    }

    async getBalance(user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const where = {
            user_id: user.id
        }

        const balance = await this.Transaction.sum("amount", where)

        if(Number.isNaN(balance)) {
            return 0
        }

        return balance
    }

}

module.exports = BillingService
