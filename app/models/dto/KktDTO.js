

class KktDTO {

    constructor({id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName, kktLastBill, server}) {
        this.id = id
        this.inn = inn
        this.companyName = companyName
        this.kktModel = kktModel
        this.kktFactoryNumber = kktFactoryNumber
        this.kktRegNumber = kktRegNumber
        this.kktFNNumber = kktFNNumber
        this.kktActivationDate = kktActivationDate
        this.kktBillsCount = kktBillsCount
        this.kktOFDRegKey = kktOFDRegKey
        this.kktLastBill = kktLastBill
        this.server = server
    }
}

module.exports = KktDTO
