class User {
    constructor(id, email, passwordHash, phone, role) {
        this.id = id
        this.email = email
        this.passwordHash = passwordHash
        this.phone = phone
        this.role = role
        this.fiscal = false
    }

}

module.exports = User
