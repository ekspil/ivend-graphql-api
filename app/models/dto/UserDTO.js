class UserDTO {

    constructor({id, email, passwordHash, phone, role}) {
        this.id = id
        this.email = email
        this.passwordHash = passwordHash
        this.phone = phone
        this.role = role
    }
}

module.exports = UserDTO
