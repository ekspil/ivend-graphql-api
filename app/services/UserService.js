const User = require("../models/User")
const bcryptjs = require("bcryptjs")

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS)

class UserService {

    constructor({ UserModel}) {
        this.User = UserModel

        this.registerUser = this.registerUser.bind(this)
    }


    async registerUser(email, password) {
        let user = new User()
        //todo validation

        //todo ensure no user with such email exists

        user.email = email
        user.passwordHash = await this.hashPassword(password)
        user.role = "USER"

        return await this.User.create(user)
    }


    async hashPassword(password) {
        return await bcryptjs.hash(password, bcryptRounds)
    }

}

module.exports = UserService
