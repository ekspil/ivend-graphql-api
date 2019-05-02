class UserDTO {

    constructor({email, phone, role, fiscal}) {
        this.email = email
        this.phone = phone
        this.role = role
        this.fiscal = fiscal
    }
}

module.exports = UserDTO
