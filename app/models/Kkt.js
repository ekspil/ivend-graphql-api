class Kkt {

    constructor(id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName, kktLastBill, server, action) {
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
        this.action = action
    }

}

module.exports = Kkt