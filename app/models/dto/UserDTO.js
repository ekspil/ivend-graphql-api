class UserDTO {

    constructor({email, phone, role, id, companyName, inn}) {
        this.email = email
        this.phone = phone
        this.role = role
        this.id = id
        this.companyName = companyName
        this.inn = inn
    }
}

module.exports = UserDTO
