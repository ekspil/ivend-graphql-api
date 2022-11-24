class UserDTO {

    constructor({email, phone, role, id, companyName, inn, step, autoSend, partner, partnerId, managerId, countryCode}) {
        this.email = email
        this.phone = phone
        this.role = role
        this.id = id
        this.companyName = companyName
        this.inn = inn
        this.step = step
        this.autoSend = autoSend
        this.patner = partner
        this.partnerId = partnerId
        this.managerId = managerId
        this.countryCode = countryCode
    }
}


module.exports = UserDTO
