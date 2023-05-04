
const NotAuthorized = require("../errors/NotAuthorized")
const AnotherDepositPending = require("../errors/AnotherDepositPending")
const InvalidPeriod = require("../errors/InvalidPeriod")
const Permission = require("../enum/Permission")
const Deposit = require("../models/Deposit")
const {Op} = require("sequelize")
const microservices = require("../utils/microservices")

class BillingService {

    constructor({DepositModel, PaymentRequestModel, ControllerModel, ServiceModel, TransactionModel, TempModel, UserModel, BankPaymentsModel, ActsModel}) {
        this.Controller = ControllerModel
        this.Service = ServiceModel
        this.Transaction = TransactionModel
        this.Temp = TempModel
        this.Deposit = DepositModel
        this.PaymentRequest = PaymentRequestModel
        this.User = UserModel
        this.BankPayment = BankPaymentsModel
        this.Acts = ActsModel

        this.getDeposits = this.getDeposits.bind(this)
        this.getDailyBill = this.getDailyBill.bind(this)
        this.getDaysLeft = this.getDaysLeft.bind(this)
        this.getDepositById = this.getDepositById.bind(this)
        this.getBalance = this.getBalance.bind(this)
        this.requestDeposit = this.requestDeposit.bind(this)
        this.changeUserBalance = this.changeUserBalance.bind(this)
    }

    async getDeposits(period, user, all, userId) {
        if (!user || !user.checkPermission(Permission.GET_SELF_DEPOSITS)) {
            throw new NotAuthorized()
        }

        const where = {}
        if(!all){
            where.user_id = user.id
        }
        if(userId){
            where.user_id = userId
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

        return await this.Deposit.findAll({
            where,
            order: [
                ["createdAt", "DESC"],
            ],
            include: [{model: this.PaymentRequest, as: "paymentRequest"}]})
    }

    async getAllBills(input, user) {
        if (!user || !user.checkPermission(Permission.GET_DEPOSITS)) {
            throw new NotAuthorized()
        }
        const {period, offset, limit, search} = input

        const where = {
            amount: {
                [Op.gt]: 0
            }
        }
        let whereUser = {}


        if( Number(search)){
            where.amount = Number(search)
        }
        else {
            whereUser = {
                [Op.or]: [
                    { companyName: {
                        [Op.like]: `%${search}%`
                    } },
                    { email: {
                        [Op.like]: `%${search}%`
                    } }
                ]
            }
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

        const transactions = await this.Transaction.findAll({
            offset,
            limit,
            where,
            order: [
                ["id", "DESC"],
            ],
            include: [{model: this.User, as: "user" , where: whereUser}]}
        )

        return {transactions}
    }
    //
    // async getAllBills(input, user) {
    //     if (!user || !user.checkPermission(Permission.GET_DEPOSITS)) {
    //         throw new NotAuthorized()
    //     }
    //     const {period, offset, limit, search, status} = input
    //
    //     const where = {}
    //     let whereUser = {}
    //    
    //     const statusDepositWhere = {}
    //
    //     if(status === "payed"){
    //         where.applied = true
    //         statusDepositWhere.status = {
    //             [Op.in]: ["SUCCEEDED", "ADMIN_EDIT"]
    //         }
    //     }
    //     if(status === "not_payed"){
    //         where.applied = false
    //         statusDepositWhere.status = {
    //             [Op.notIn]: ["SUCCEEDED", "ADMIN_EDIT"]
    //         }
    //     }
    //    
    //    
    //
    //     if( Number(search)){
    //         where.amount = Number(search)
    //     }
    //     else {
    //         whereUser = {
    //             [Op.or]: [
    //                 { companyName: {
    //                     [Op.like]: `%${search}%`
    //                 } },
    //                 { email: {
    //                     [Op.like]: `%${search}%`
    //                 } }
    //             ]
    //         }
    //     }
    //
    //     if (period) {
    //         const {from, to} = period
    //
    //         if (from > to) {
    //             throw new InvalidPeriod()
    //         }
    //
    //         where.createdAt = {
    //             [Op.lt]: to,
    //             [Op.gt]: from
    //         }
    //     }
    //     const bills =  await this.BankPayment.findAll({
    //         offset,
    //         limit,
    //         where,
    //         order: [
    //             ["createdAt", "DESC"],
    //         ],
    //         include: [{model: this.User, as: "user", where: whereUser}]
    //     })
    //
    //     delete where.applied
    //     const deposits = await this.Deposit.findAll({
    //         offset,
    //         limit,
    //         where,
    //         order: [
    //             ["createdAt", "DESC"],
    //         ],
    //         include: [{model: this.PaymentRequest, as: "paymentRequest", where: statusDepositWhere}, {model: this.User, as: "user" , where: whereUser}]}
    //     )
    //
    //     return {bills, deposits}
    // }

    async getDailyBill(user, userId) {
        if (!user || !user.checkPermission(Permission.GET_DAILY_BILL)) {
            throw new NotAuthorized()
        }




        const telemetryPrice = await microservices.billing.getServiceDailyPrice("TELEMETRY", userId)

        const orangeStatistic = await this.getOrangeStatistic(user, userId)

        const dayOrange = (-orangeStatistic) / 30

        return (telemetryPrice + dayOrange).toFixed(2)
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

        const row = await this.Temp.findOne({where})
        if (row && isFinite(row.amount)){
            return row.amount
        }

        const balance = await this.Transaction.sum("amount", {where})

        if (!isFinite(balance)) {
            return 0
        }

        return balance
    }
    async getOrangeStatistic(user, userId) {
        if (!user || !user.checkPermission(Permission.GET_BALANCE)) {
            throw new NotAuthorized()
        }
        const date = (new Date()).getTime()

        const where = {
            user_id: userId,
        }

        where.createdAt = {
            [Op.lt]: date,
            [Op.gt]: (date - 30 * 24 * 60 * 60 * 1000)
        }
        where.meta = {
            [Op.like]: "%orange_fiscal_billing%"
        }

        const rows = await this.Transaction.findAll({where})

        if(!rows || rows.length === 0) return null

        const result =  rows.reduce((acc, item)=>{
            return acc + Number(item.amount)
        },0)


        return result




    }

    async getDepositById(id, user, userId) {
        if (!user || !user.checkPermission(Permission.GET_DEPOSIT_BY_ID)) {
            throw new NotAuthorized()
        }
        let where
        if(userId){
            where = {
                id,
                user_id: userId
            }
        }
        else {
            where = {
                id,
                user_id: user.id
            }
        }


        return await this.Deposit.findOne({where})
    }

    async getActs(userId, user) {
        if (!user || !user.checkPermission(Permission.GET_ACTS)) {
            throw new NotAuthorized()
        }
        const where = {}
        if(userId){
            where.userId = userId
        }
        else{
            where.userId = user.id
        }

        return await this.Acts.findAll({where})
    }

    async removeDeposit(id, user) {
        if (!user || !user.checkPermission(Permission.GET_DEPOSIT_BY_ID)) {
            throw new NotAuthorized()
        }

        const where = {
            id,
            user_id: user.id
        }

        const deposit = await this.Deposit.findOne({where})
        if(!deposit) return false
        await deposit.destroy()
        return true
    }


    async changeUserBalance(id, sum, user) {
        if (!user || !user.checkPermission(Permission.CHANGE_USER_BALANCE)) {
            throw new NotAuthorized()
        }

        const paymentRequestId = await microservices.billing.changeUserBalance(id, sum)
        const where = {
            user_id: id
        }

        const balance = await this.Transaction.sum("amount", {where})

        if (!isFinite(balance)) {
            return 0
        }

        const deposit = new Deposit()
        deposit.amount = sum
        deposit.payment_request_id = paymentRequestId
        deposit.user_id = id

        await this.Deposit.create(deposit, {
            include: [{
                model: this.PaymentRequest,
                as: "paymentRequest"
            }]
        })

        const targetUser = await this.User.findOne({
            where: {
                id
            }
        })

        if(targetUser.step < 6){
            targetUser.step = 6
            await targetUser.save()
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


        if(user.step < 6){
            user.step = 6
            await user.save()
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
