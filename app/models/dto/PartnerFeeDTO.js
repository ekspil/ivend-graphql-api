
class PartnerFeeDTO {


    constructor({id, userId, partnerId, controllerFee, kkmFee, terminalFee}) {
        this.id = id
        this.userId = userId
        this.partnerId = partnerId
        this.controllerFee = controllerFee
        this.kkmFee = kkmFee
        this.terminalFee = terminalFee
    }
}

module.exports = PartnerFeeDTO
