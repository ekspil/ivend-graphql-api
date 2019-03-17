const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")
const {Op} = require("sequelize")
const User = require("../models/User")
const bcryptjs = require("bcryptjs")
const hashingUtils = require("../utils/hashingUtils")
const logger = require("../utils/logger")

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS)

class UserService {

    constructor({UserModel, redis}) {
        this.User = UserModel
        this.redis = redis

        this.registerUser = this.registerUser.bind(this)
        this.requestToken = this.requestToken.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }


    async registerUser(input, role) {

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
        user.role = role || "USER"

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

        await this.redis.hset("tokens", token, user.id)


        if (user.email === "test_invalid_token") {
            setTimeout(() => {
                logger.info("Purging token for test_invalid_token user ", token)
                //purge token
                this.redis.hdel("tokens", token)
            }, 5000)
        }

        return token
    }

    async getProfile(user) {
        if (!user || !user.checkPermission(Permission.GET_PROFILE)) {
            throw new NotAuthorized()
        }

        return await this.User.findOne({
            where: {
                id: user.id
            }
        })
    }


    async hashPassword(password) {
        return await bcryptjs.hash(password, bcryptRounds)
    }

}

module.exports = UserService
