class User {
    constructor(id, email, passwordHash, phone, role, companyName, inn, step, autoSend) {
        this.id = id
        this.email = email
        this.passwordHash = passwordHash
        this.phone = phone
        this.role = role
        this.companyName = companyName
        this.inn = inn
        this.step = step
        this.autoSend = autoSend
    }
}


module.exports = User
