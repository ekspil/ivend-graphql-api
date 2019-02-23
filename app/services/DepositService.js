const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")
const Deposit = require("../models/Deposit")
const fetch = require("node-fetch")


class DepositService {

    constructor({DepositModel, PaymentRequestModel}) {

        this.Deposit = DepositModel
        this.PaymentRequest = PaymentRequestModel

        this.requestDeposit = this.requestDeposit.bind(this)


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

module.exports = DepositService
