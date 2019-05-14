class Kkt {

    constructor(id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName) {
        
        this.kktModel = kktModel
        this.inn = inn
        this.companyName = companyName
        this.kktFactoryNumber = kktFactoryNumber
        this.kktRegNumber = kktRegNumber
        this.kktFNNumber = kktFNNumber
        this.kktActivationDate = kktActivationDate
        this.kktBillsCount = kktBillsCount
        this.kktOFDRegKey = kktOFDRegKey
    }

}

module.exports = Kkt