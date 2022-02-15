const FiscalReceiptDataDTO = require("../models/FiscalReceiptDataDTO")


class FiscalReceiptDTO {

    constructor({id, email, sno, inn, place, itemName, itemPrice, paymentType, fiscalData, status, createdAt, kktRegNumber, itemType, controllerUid, kktProvider, rekassa_kkt_id, rekassa_number, rekassa_password}) {
        this.id = id
        this.email = email
        this.sno = sno
        this.inn = inn
        this.place = place
        this.itemName = itemName
        this.itemPrice = itemPrice
        this.itemType = itemType
        this.paymentType = paymentType
        this.fiscalData = fiscalData ? new FiscalReceiptDataDTO(fiscalData): null
        this.kktRegNumber = kktRegNumber
        this.controllerUid = controllerUid
        this.status = status
        this.createdAt = createdAt
        this.kktProvider = kktProvider
        this.rekassa_password = rekassa_password
        this.rekassa_number = rekassa_number
        this.rekassa_kkt_id = rekassa_kkt_id
    }

}

module.exports = FiscalReceiptDTO
