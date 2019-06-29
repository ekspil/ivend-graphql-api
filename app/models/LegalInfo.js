class Item {
    constructor(id, companyName, city, actualAddress, inn, ogrn, legalAddress, director, directorPhone, directorEmail, contactPerson, contactPhone, contactEmail, sno) {
        this.id = id
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
        this.sno = sno
    }
}

module.exports = Item
