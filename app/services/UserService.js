const {Op} = require("sequelize")
const User = require("../models/User")
const bcryptjs = require("bcryptjs")

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS)

class UserService {

    constructor({UserModel}) {
        this.User = UserModel

        this.registerUser = this.registerUser.bind(this)
    }


    async registerUser(input) {

        const {email, phone, password} = input

        //todo validation

        const users = await this.User.findAll({
            where: {
                [Op.or]: [{email}, {phone}]
            }
        })

        if (users && users.length > 0) {
            throw new Error("User with such email or phone already exists")
        }

        const user = new User()

        user.phone = phone
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
