const NotAuthorized = require("../errors/NotAuthorized")
const UserExists = require("../errors/UserExists")
const PhonePasswordMatchFailed = require("../errors/PhonePasswordMatchFailed")
const SmsCodeMatchFailed = require("../errors/SmsCodeMatchFailed")
const SmsCodeTimeout = require("../errors/SmsCodeTimeout")
const PhoneNotValid = require("../errors/PhoneNotValid")
const Permission = require("../enum/Permission")
const {Op} = require("sequelize")
const User = require("../models/User")
const bcryptjs = require("bcryptjs")
const hashingUtils = require("../utils/hashingUtils")
const validationUtils = require("../utils/validationUtils")
const logger = require("../utils/logger")
const microservices = require("../utils/microservices")

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS)

class UserService {

    constructor({UserModel, redis, machineService}) {
        this.User = UserModel
        this.redis = redis
        this.machineService = machineService

        this.registerUser = this.registerUser.bind(this)
        this.requestToken = this.requestToken.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.requestRegistrationSms = this.requestRegistrationSms.bind(this)
    }


    async registerUser(input, role) {
        return this.User.sequelize.transaction(async (transaction) => {
            const {email, code, phone, password} = input

            //todo validation
            if (!validationUtils.validatePhoneNumber(phone)) {
                throw new PhoneNotValid()
            }

            const users = await this.User.findAll({
                where: {
                    [Op.or]: [{email}, {phone}]
                }
            })

            if (users && users.length > 0) {
                throw new UserExists()
            }

            if (Number(process.env.SMS_REGISTRATION_ENABLED)) {
                // Check the code
                const smsCode = await this.redis.hget(`registration_${phone}`, "code")
                const timeoutTimestamp = await this.redis.hget(`registration_${phone}`, "timeout_at")
                const timeoutDate = new Date(Number(timeoutTimestamp))

                if (smsCode !== code) {
                    throw new SmsCodeMatchFailed()
                }

                if (new Date() > timeoutDate) {
                    throw new SmsCodeTimeout()
                }

            }

            let user = new User()

            user.phone = phone
            user.email = email
            user.passwordHash = await this.hashPassword(password)
            user.role = role || "USER"

            user = await this.User.create(user, {transaction})

            user.checkPermission = () => true

            await this.machineService.createMachineGroup({name: process.env.DEFAULT_MACHINE_GROUP_NAME}, user, transaction)

            return user
        })
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
            throw new PhonePasswordMatchFailed()
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


    async requestRegistrationSms(input) {
        //todo validation
        const {phone} = input

        if (!validationUtils.validatePhoneNumber(phone)) {
            throw new PhoneNotValid()
        }

        if (!Number(process.env.SMS_REGISTRATION_ENABLED)) {
            throw new Error("Sms registration is not enabled")
        }

        const user = await this.User.findOne({
            where: {
                phone
            }
        })

        if (user) {
            throw new UserExists()
        }

        const currentCode = await this.redis.hget(`registration_${phone}`, "code")

        if (currentCode) {
            const requestAgainTimestamp = await this.redis.hget(`registration_${phone}`, "request_again_at")
            const requestAgainDate = new Date(Number(requestAgainTimestamp))

            if (new Date() < requestAgainDate) {
                throw new Error("You have to wait 60 seconds between requests")
            }
        }

        const requestAgainDate = new Date()
        requestAgainDate.setMinutes(requestAgainDate.getMinutes() + Number(process.env.SMS_REQUEST_DELAY_MINUTES))

        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + Number(process.env.SMS_TIMEOUT_MINUTES))

        const randomCode = await hashingUtils.generateRandomAccessKey(3)
        const smsCode = ((parseInt(randomCode, 16) % 1000000) + "").padStart(6, 0)

        await microservices.notification.sendRegistrationSms(phone, smsCode)

        await this.redis.hset("registration_" + phone, "code", smsCode)
        await this.redis.hset("registration_" + phone, "request_again_at", requestAgainDate.getTime())
        await this.redis.hset("registration_" + phone, "timeout_at", expiryDate.getTime())

        logger.debug(`SMS code for ${phone} is ${smsCode}. Valid until ${expiryDate}, may request again at ${requestAgainDate}`)

        return expiryDate
    }


    async hashPassword(password) {
        return await bcryptjs.hash(password, bcryptRounds)
    }

}

module.exports = UserService
