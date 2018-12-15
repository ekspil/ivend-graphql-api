const UserEntity = require("../entities/UserEntity")
const User = require("../models/User")
const bcryptjs = require("bcryptjs")

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS)

class UserService {

    constructor(userRepository) {
        this.userRepository = userRepository

        this.registerUser = this.registerUser.bind(this)
    }


    async registerUser(email, password) {
        let user = new User();
        //todo validation

        //todo ensure no user with such email exists

        user.email = email;
        user.passwordHash = await this.hashPassword(password)

        return await this.userRepository.save(user)
    }


    async hashPassword(password) {
        return await bcryptjs.hash(password, bcryptRounds)
    }

}

module.exports = UserService
