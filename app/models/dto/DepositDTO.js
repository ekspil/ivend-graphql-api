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
                this.status = "SUCCEDED"
                break
            case "canceled":
                this.status = "CANCELED"
                break
            default:
                throw new Error("Unknown status received from payment")
        }
    }
}

module.exports = DepositDTO
