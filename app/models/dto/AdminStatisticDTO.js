

class AdminStatisticDTO {

    constructor({id, billingAmount, billingBalance, billingCredit, controllersCount, controllersDisabled, controllersDisconnected, kktsCount, kktsNormal, kktsError, informationStatus}) {
        this.id = id
        this.billingAmount = billingAmount
        this.billingBalance = billingBalance
        this.billingCredit = billingCredit
        this.controllersCount = controllersCount
        this.controllersDisabled = controllersDisabled
        this.controllersDisconnected = controllersDisconnected
        this.kktsCount = kktsCount
        this.kktsNormal = kktsNormal
        this.kktsError = kktsError
        this.informationStatus = informationStatus
    }
}
module.exports = AdminStatisticDTO
