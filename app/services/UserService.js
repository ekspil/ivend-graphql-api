const User = require("../models/User")
const bcryptjs = require("bcryptjs")

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS)

class UserService {

    constructor(injects) {
        const { userRepository, roleRepository } = injects

        this.userRepository = userRepository
        this.roleRepository = roleRepository

        this.registerUser = this.registerUser.bind(this)
    }


    async registerUser(email, password) {
        let user = new User()
        //todo validation

        //todo ensure no user with such email exists

        const role = await this.roleRepository.findOne({ name: "USER" })

        if (!role) {
            throw new Error("Unknown role USER")
        }

        user.email = email
        user.passwordHash = await this.hashPassword(password)
        user.role = role

        return await this.userRepository.save(user)
    }


    async hashPassword(password) {
        return await bcryptjs.hash(password, bcryptRounds)
    }

}

module.exports = UserService
