const ControllerStatus = require("../enum/ControllerStatus")
const NotAuthorized = require("../errors/NotAuthorized")
const AnotherDepositPending = require("../errors/AnotherDepositPending")
const InvalidPeriod = require("../errors/InvalidPeriod")
const Permission = require("../enum/Permission")
const Deposit = require("../models/Deposit")
const {Op} = require("sequelize")
const microservices = require("../utils/microservices")

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
        this.getDepositById = this.getDepositById.bind(this)
        this.getBalance = this.getBalance.bind(this)
        this.requestDeposit = this.requestDeposit.bind(this)
        this.changeUserBalance = this.changeUserBalance.bind(this)
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

            if (from > to) {
                throw new InvalidPeriod()
            }

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        return await this.Deposit.findAll({where, include: [{model: this.PaymentRequest, as: "paymentRequest"}]})
    }

    async getDailyBill(user, userId) {
        if (!user || !user.checkPermission(Permission.GET_DAILY_BILL)) {
            throw new NotAuthorized()
        }

        const controllers = await this.Controller.findAll({
            where: {
                user_id: userId,
                status: ControllerStatus.ENABLED
            }
        })

        const telemetryPrice = await microservices.billing.getServiceDailyPrice("TELEMETRY", userId)

        return controllers.reduce((acc) => {
            return acc + Number(telemetryPrice)
        }, 0).toFixed(2)
    }

    async getDaysLeft(user, userId) {
        if (!user || !user.checkPermission(Permission.GET_DAYS_LEFT)) {
            throw new NotAuthorized()
        }

        const dailyBill = await this.getDailyBill(user, userId)
        const balance = await this.getBalance(user, userId)

        const daysLeft = Math.floor(balance / dailyBill)

        if (!isFinite(daysLeft)) {
            return 0
        }

        return daysLeft
    }

    async getBalance(user, userId) {
        if (!user || !user.checkPermission(Permission.GET_BALANCE)) {
            throw new NotAuthorized()
        }

        const where = {
            user_id: userId
        }

        const balance = await this.Transaction.sum("amount", {where})

        if (!isFinite(balance)) {
            return 0
        }

        return balance
    }

    async getDepositById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_DEPOSIT_BY_ID)) {
            throw new NotAuthorized()
        }

        const where = {
            id,
            user_id: user.id
        }

        return await this.Deposit.findOne({where})
    }
    async changeUserBalance(id, sum, user) {
        if (!user || !user.checkPermission(Permission.CHANGE_USER_BALANCE)) {
            throw new NotAuthorized()
        }

        await microservices.billing.changeUserBalance(id, sum)

        const where = {
            user_id: id
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
            const paymentRequestId = await microservices.billing.createPaymentRequest(amount, user)

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
        })
    }
}

module.exports = BillingService
