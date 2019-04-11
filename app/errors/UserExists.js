class UserExists extends Error {

    constructor() {
        super()

        this.message = "User with such email or phone already exists"
    }
}

module.exports = UserExists
