class LegalInfoDTO {

    constructor({companyName, city, actualAddress, inn, ogrn, legalAddress, director, directorPhone, directorEmail, contactPerson, contactPhone, contactEmail}) {
        this.companyName = companyName
        this.city = city
        this.actualAddress = actualAddress
        this.inn = inn
        this.ogrn = ogrn
        this.legalAddress = legalAddress
        this.director = director
        this.directorPhone = directorPhone
        this.directorEmail = directorEmail
        this.contactPerson = contactPerson
        this.contactPhone = contactPhone
        this.contactEmail = contactEmail
    }
}

module.exports = LegalInfoDTO
