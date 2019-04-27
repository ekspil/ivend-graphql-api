

class KktDTO {

    constructor({id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey}) {
        this.kkt.id = id
        this.kkt.kktModel = kktModel
        this.kkt.kktFactoryNumber = kktFactoryNumber
        this.kkt.kktRegNumber = kktRegNumber
        this.kkt.kktFNNumber = kktFNNumber
        this.kkt.kktActivationDate = kktActivationDate
        this.kkt.kktBillsCount = kktBillsCount
        this.kkt.kktOFDRegKey = kktOFDRegKey
    }
}

module.exports = KktDTO
