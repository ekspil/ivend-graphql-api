class User {
    constructor(id, email, passwordHash, phone, role, companyName, inn) {
        this.id = id
        this.email = email
        this.passwordHash = passwordHash
        this.phone = phone
        this.role = role
        this.companyName = companyName
        this.inn = inn
    }

}

module.exports = User
