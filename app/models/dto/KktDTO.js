


class KktDTO {

    constructor({id, action, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName, kktLastBill, server, kktStatus}) {
        this.id = id
        this.inn = inn
        this.companyName = companyName
        this.kktModel = kktModel
        this.kktStatus = kktStatus
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

module.exports = KktDTO
