const UnknownPaymentStatus = require("../../errors/UnknownPaymentStatus")

class DepositDTO {

    constructor({id, amount, status, redirectUrl}) {
        this.id = id
        this.amount = amount
        this.redirectUrl = redirectUrl

        switch (status) {
            case "pending":
            case "waiting_for_capture":
                this.status = "PENDING"
                break
            case "succeeded":
                this.status = "SUCCEEDED"
                break
            case "canceled":
                this.status = "CANCELLED"
                break
            default:
                throw new UnknownPaymentStatus
        }
    }
}

module.exports = DepositDTO
