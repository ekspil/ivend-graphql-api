
class PartnerFeeDTO {


    constructor({id, userId, partnerId, controllerFee, kkmFee, terminalFee, createdAt, status}) {
        this.id = id
        this.userId = userId
        this.partnerId = partnerId
        this.controllerFee = controllerFee
        this.kkmFee = kkmFee
        this.terminalFee = terminalFee
        this.createdAt = createdAt
        this.status = status
    }
}

module.exports = PartnerFeeDTO
