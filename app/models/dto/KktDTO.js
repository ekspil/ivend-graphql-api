


class KktDTO {

    constructor({id, action, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, type, companyName, kktLastBill, server, kktStatus, rekassaPassword, rekassaNumber, rekassaKktId}) {
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
        this.type = type
        this.action = action
        this.rekassaPassword = rekassaPassword
        this.rekassaNumber = rekassaNumber
        this.rekassaKktId = rekassaKktId
    }
}

module.exports = KktDTO
