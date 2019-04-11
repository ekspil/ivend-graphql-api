class UserNotFound extends Error {

    constructor() {
        super()

        this.message = "User not found"
    }
}

module.exports = UserNotFound
