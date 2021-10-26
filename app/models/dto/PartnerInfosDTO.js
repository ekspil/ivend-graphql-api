
class PartnerInfosDTO {


    constructor({id, partnerId, fileLogo, fileOferta, infoPhoneTech, infoMailTech, infoPhoneCom, infoRequisites}) {
        this.id = id
        this.partnerId = partnerId
        this.fileLogo = fileLogo
        this.fileOferta = fileOferta
        this.infoPhoneTech = infoPhoneTech
        this.infoMailTech = infoMailTech
        this.infoPhoneCom = infoPhoneCom
        this.infoRequisites = infoRequisites
    }
}

module.exports = PartnerInfosDTO
