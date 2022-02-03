

class AdminStatisticDTO {

    constructor({id, billingAmount, billingBalance, billingCredit, controllersCount, controllersDisabled, controllersDisconnected, kktsCount, kktsNormal, kktsError, informationStatus, simTraffic, simExpense, simCount}) {
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
        this.simTraffic = simTraffic
        this.simExpense = simExpense
        this.simCount = simCount
    }
}
module.exports = AdminStatisticDTO
