class User {
    constructor(id, email, passwordHash, phone, role, companyName, inn, step, autoSend, partner, partnerId) {
        this.id = id
        this.email = email
        this.passwordHash = passwordHash
        this.phone = phone
        this.role = role
        this.companyName = companyName
        this.inn = inn
        this.step = step
        this.autoSend = autoSend
        this.patner = partner
        this.partnerId = partnerId
    }
}


module.exports = User
