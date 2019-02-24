const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")
const Deposit = require("../models/Deposit")
const fetch = require("node-fetch")


class BillingService {

    constructor({DepositModel, PaymentRequestModel, ControllerModel, ServiceModel, TransactionModel}) {
        this.Controller = ControllerModel
        this.Service = ServiceModel
        this.Transaction = TransactionModel
        this.Deposit = DepositModel
        this.PaymentRequest = PaymentRequestModel

        this.getDeposits = this.getDeposits.bind(this)
        this.getDailyBill = this.getDailyBill.bind(this)
        this.getDaysLeft = this.getDaysLeft.bind(this)
        this.getBalance = this.getBalance.bind(this)
        this.requestDeposit = this.requestDeposit.bind(this)
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

    async requestDeposit(amount, user) {
        if (!user || !user.checkPermission(Permission.AUTH_CONTROLLER)) {
            throw new NotAuthorized()
        }


        //todo move out to func
        const deposit = await this.Deposit.findOne({
            where: {
                user_id: user.id
            },
            order: [
                ["id", "DESC"],
            ],
            include: [{model: this.PaymentRequest, as: "paymentRequest"}]
        })

        if (deposit && deposit.paymentRequest.status === "pending") {
            throw new Error("Another deposit already in process")
        }

        //todo transaction here is overkill
        return this.Deposit.sequelize.transaction(async () => {
            // Request payment from the billing

            const body = JSON.stringify({
                amount,
                to: user.phone
            })

            const response = await fetch(`${process.env.BILLING_URL}/api/v1/billing/createPayment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
            })

            switch (response.status) {
                case 200:
                    const json = await response.json()
                    const {paymentRequestId} = json

                    const deposit = new Deposit()
                    deposit.amount = amount
                    deposit.payment_request_id = paymentRequestId
                    deposit.user_id = user.id

                    return await this.Deposit.create(deposit, {
                        include: [{
                            model: this.PaymentRequest,
                            as: "paymentRequest"
                        }]
                    })

                default:
                    throw new Error("Unknown error during creating payment request")
            }


        })
    }

}

module.exports = BillingService
