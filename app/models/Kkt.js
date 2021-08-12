class Kkt {

    constructor(id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName, kktLastBill, server, type, action, rekassaPassword, rekassaNumber, rekassaKktId) {
        this.id = id
        this.kktModel = kktModel
        this.inn = inn
        this.companyName = companyName
        this.kktFactoryNumber = kktFactoryNumber
        this.kktRegNumber = kktRegNumber
        this.kktFNNumber = kktFNNumber
        this.kktActivationDate = kktActivationDate
        this.kktBillsCount = kktBillsCount
        this.kktOFDRegKey = kktOFDRegKey
        this.kktLastBill = kktLastBill
        this.server = server
        this.type = type
        this.action = action
        this.rekassaPassword = rekassaPassword
        this.rekassaNumber = rekassaNumber
        this.rekassaKktId = rekassaKktId
    }

}

module.exports = Kkt