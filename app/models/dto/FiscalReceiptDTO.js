const SaleDTO = require("./SaleDTO")

class FiscalReceiptDTODTO {

    constructor({id, inn, kpp, legalAddress, companyName, sale, fnsSite, receiptDatetime, shiftNumber, fiscalReceiptNumber, fiscalDocumentNumber, ecrRegistrationNumber, fiscalDocumentAttribute, fnNumber}) {
        this.id = id
        this.inn = inn
        this.kpp = kpp
        this.legalAddress = legalAddress
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


    }
}

module.exports = FiscalReceiptDTODTO
