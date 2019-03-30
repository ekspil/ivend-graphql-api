const NotAuthorized = require("../errors/NotAuthorized")
const AnotherDepositPending = require("../errors/AnotherDepositPending")
const DepositRequestFailed = require("../errors/DepositRequestFailed")
const Permission = require("../enum/Permission")
const Deposit = require("../models/Deposit")
const fetch = require("node-fetch")
const {Op} = require("sequelize")


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

    async getDeposits(period, user) {
        if (!user || !user.checkPermission(Permission.GET_SELF_DEPOSITS)) {
            throw new NotAuthorized()
        }

        const where = {
            user_id: user.id
        }

        if (period) {
            const {from, to} = period

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        return await this.Deposit.findAll({where, include: [{model: this.PaymentRequest, as: "paymentRequest"}]})
    }

    async getDailyBill(user) {
        if (!user || !user.checkPermission(Permission.GET_DAILY_BILL)) {
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

        const mapped = await Promise.all(controllersWithServices.map(async (controllerWithServices) => {
            const {services} = controllerWithServices

            const mappedServices = await Promise.all(services.map(async (service) => {
                if (service.billingType === "MONTHLY") {
                    const {sequelize} = this.Service

                    const [datePart] = await sequelize.query("SELECT DATE_PART('days',  DATE_TRUNC('month', NOW())  + '1 MONTH'::INTERVAL  - '1 DAY'::INTERVAL)",
                        {type: sequelize.QueryTypes.SELECT}
                    )
                    const daysInMonth = datePart.date_part

                    const [dayPriceResult] = await sequelize.query("SELECT ROUND(:price::NUMERIC / :days::NUMERIC, 2) as day_price",
                        {replacements: {price: service.price, days: daysInMonth}, type: sequelize.QueryTypes.SELECT}
                    )

                    return {price: dayPriceResult.day_price}
                }

                return {price: service.price}
            }))

            return {services: mappedServices}
        }))

        return mapped.reduce((acc, controllerWithServices) => {
            const {services} = controllerWithServices

            return acc + services.reduce((acc, service) => {
                return acc + Number(service.price)
            }, 0)

        }, 0)
    }

    async getDaysLeft(user) {
        if (!user || !user.checkPermission(Permission.GET_DAYS_LEFT)) {
            throw new NotAuthorized()
        }

        const dailyBill = await this.getDailyBill(user)
        const balance = await this.getBalance(user)

        const daysLeft = Math.floor(balance / dailyBill)

        if (!isFinite(daysLeft)) {
            return 0
        }

        return daysLeft
    }

    async getBalance(user) {
        if (!user || !user.checkPermission(Permission.GET_BALANCE)) {
            throw new NotAuthorized()
        }

        const where = {
            user_id: user.id
        }

        const balance = await this.Transaction.sum("amount", {where})

        if (!isFinite(balance)) {
            return 0
        }

        return balance
    }

    async requestDeposit(amount, user) {
        if (!user || !user.checkPermission(Permission.REQUEST_DEPOSIT)) {
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
            throw new AnotherDepositPending()
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
                    throw new DepositRequestFailed()
            }


        })
    }

}

module.exports = BillingService
