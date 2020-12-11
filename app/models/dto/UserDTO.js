class UserDTO {

    constructor({email, phone, role, id, companyName, inn, step, autoSend, partner, partnerId}) {
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
    }
}


module.exports = UserDTO
