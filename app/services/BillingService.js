const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")


class BillingService {

    constructor({ControllerServiceModel, ControllerModel, ServiceModel, TransactionModel, DepositModel, PaymentRequestModel}) {
        this.ControllerService = ControllerServiceModel
        this.Controller = ControllerModel
        this.Service = ServiceModel
        this.Transaction = TransactionModel
        this.Deposit = DepositModel
        this.PaymentRequest = PaymentRequestModel

        this.getDeposits = this.getDeposits.bind(this)
        this.getDailyBill = this.getDailyBill.bind(this)
        this.getDaysLeft = this.getDaysLeft.bind(this)
        this.getBalance = this.getBalance.bind(this)
    }

    async getDeposits(user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const where = {
            user_id: user.id
        }

        return await this.Deposit.findAll({where, include: [{model: this.PaymentRequest, as: "paymentRequest"}]})
    }

    async getDailyBill(user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const controllersWithServices = await this.Controller.findAll({
            include: [
                {model: this.Service}
            ],
            where: {
                user_id: user.id
            }
        })

        return controllersWithServices.reduce((acc, controllerWithServices) => {
            const {services} = controllerWithServices

            return acc + services.reduce((acc, service) => {
                return acc + Number(service.price)
            }, 0)

        }, 0)
    }

    async getDaysLeft(user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const dailyBill = await this.getDailyBill(user)
        const balance = await this.getBalance(user)

        return Math.floor(balance / dailyBill)
    }

    async getBalance(user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }

        const where = {
            user_id: user.id
        }

        const balance = await this.Transaction.sum("amount", where)

        if (Number.isNaN(balance)) {
            return 0
        }

        return balance
    }

}

module.exports = BillingService
