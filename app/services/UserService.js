const {Op} = require("sequelize")
const User = require("../models/User")
const bcryptjs = require("bcryptjs")
const hashingUtils = require("../utils/hashingUtils")

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

    async requestToken(input) {
        const {phone, password} = input

        //todo validation

        const user = await this.User.findOne({
            where: {
                phone
            }
        })

        const passwordMatched = user && await bcryptjs.compare(password, user.passwordHash)

        if (!user || !passwordMatched) {
            throw new Error("Phone and password does not match")
        }

        const token = await hashingUtils.generateRandomAccessKey()

        for (const token of Object.keys(global.tokens)) {
            if(global.tokens[token] === user.id) {
                delete global.tokens[token]
            }
        }

        global.tokens[token] = user.id

        return token
    }

    async hashPassword(password) {
        return await bcryptjs.hash(password, bcryptRounds)
    }

}

module.exports = UserService
