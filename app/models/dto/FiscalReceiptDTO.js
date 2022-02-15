const SaleDTO = require("./SaleDTO")

class FiscalReceiptDTODTO {

    constructor({id, inn, kpp, legalAddress, companyName, sale, fnsSite, receiptDatetime, shiftNumber, email, itemType, fiscalReceiptNumber, fiscalDocumentNumber, ecrRegistrationNumber, fiscalDocumentAttribute, fnNumber, sno, place, machineNumber, kktProvider}) {
        this.id = id
        this.inn = inn
        this.kpp = kpp
        this.sno = sno
        this.place = place
        this.machineNumber = machineNumber
        this.legalAddress = legalAddress
        this.email = email
        this.itemType = itemType
        this.companyName = companyName
        this.sale = sale ? new SaleDTO(sale) : null
        this.fnsSite = fnsSite
        this.receiptDatetime = receiptDatetime
        this.shiftNumber = shiftNumber
        this.fiscalReceiptNumber = fiscalReceiptNumber
        this.fiscalDocumentNumber = fiscalDocumentNumber
        this.ecrRegistrationNumber = ecrRegistrationNumber
        this.fiscalDocumentAttribute = fiscalDocumentAttribute
        this.fnNumber = fnNumber
        this.kktProvider = kktProvider


    }
}

module.exports = FiscalReceiptDTODTO
