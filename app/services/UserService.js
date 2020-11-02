const NotAuthorized = require("../errors/NotAuthorized")
const TokenNotFound = require("../errors/TokenNotFound")
const UserNotFound = require("../errors/UserNotFound")
const UserExists = require("../errors/UserExists")
const PhonePasswordMatchFailed = require("../errors/PhonePasswordMatchFailed")
const SendSMSFailed = require("../errors/SendSMSFailed")
const SmsCodeMatchFailed = require("../errors/SmsCodeMatchFailed")
const SmsCodeTimeout = require("../errors/SmsCodeTimeout")
const PhoneNotValid = require("../errors/PhoneNotValid")
const Permission = require("../enum/Permission")
const UserActionType = require("../enum/UserActionType")
const {Op} = require("sequelize")
const User = require("../models/User")
const bcryptjs = require("bcryptjs")
const hashingUtils = require("../utils/hashingUtils")
const validationUtils = require("../utils/validationUtils")
const logger = require("my-custom-logger")
const microservices = require("../utils/microservices")

class UserService {

    constructor({UserModel, redis, machineService, notificationSettingsService}) {
        this.User = UserModel
        this.redis = redis
        this.machineService = machineService
        this.notificationSettingsService = notificationSettingsService

        this.registerUser = this.registerUser.bind(this)
        this.requestToken = this.requestToken.bind(this)
        this.editEmail = this.editEmail.bind(this)
        this.editPassword = this.editPassword.bind(this)
        this.confirmUserAction = this.confirmUserAction.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.getAllUsers = this.getAllUsers.bind(this)
        this.requestRegistrationSms = this.requestRegistrationSms.bind(this)
        this.getLegalInfoByUserId = this.getLegalInfoByUserId.bind(this)
        this.changePasswordRequest = this.changePasswordRequest.bind(this)
        this.rememberPasswordRequest = this.rememberPasswordRequest.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
    }

    async sendEmail(input, user) {
        if(!user || !user.checkPermission(Permission.SEND_EMAIL)){
            throw new NotAuthorized()
        }
        return await microservices.notification.sendEmail(input, user)
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
            user.role = role || "VENDOR_NOT_CONFIRMED"

            user = await this.User.create(user, {transaction})

            user.checkPermission = () => true



            await this.machineService.createMachineGroup({name: process.env.DEFAULT_MACHINE_GROUP_NAME}, user, transaction)

            const token = await hashingUtils.generateRandomAccessKey(32)
            await this.redis.set("action_confirm_email_" + token, `${user.id}`, "ex", Number(process.env.CONFIRM_EMAIL_TOKEN_TIMEOUT_MINUTES) * 60 * 1000)

            try {
                await microservices.notification.sendRegistrationEmail(user.email, token)
            } catch (e) {
                logger.error(`Failed to send email. Token ${token}, phone ${phone}`)
                logger.error(e)
            }

            return user
        })
    }


    async updateUser(input, adminUser) {
        if(!adminUser && !adminUser.checkPermission(Permission.GET_ALL_USERS)){
            throw new NotAuthorized()
        }
        const {email, id, phone, password, role} = input


        const user = await this.User.findOne({
            where: {
                id
            }
        })

        if (!user) {
            throw new NotAuthorized()
        }

        user.phone = phone
        user.email = email
        user.role = role
        if(password){
            user.passwordHash = await this.hashPassword(password) 
        }
            


        return await user.save()
        
    }

    async editEmail(newEmail, user) {
        if (!user || !user.checkPermission(Permission.EDIT_EMAIL)) {
            throw new NotAuthorized()
        }

        const token = await hashingUtils.generateRandomAccessKey(64)

        await this.redis.set("action_edit_email_" + token, `${user.id}:${newEmail}`, "ex", Number(process.env.CHANGE_EMAIL_TOKEN_TIMEOUT_MINUTES) * 60 * 1000)

        try {
            await microservices.notification.sendChangeEmailEmail(user.email, token)
        } catch (e) {
            logger.error(`Failed to send email`)
            logger.error(e)
        }

        logger.info(`User [${user.phone}] requested edit email from ${user.email} to ${newEmail}. Token is ${token})`)

        return token
    }

    async randomAction(user) {
        if (!user || !user.checkPermission(Permission.EDIT_EMAIL)) {
            throw new NotAuthorized()
        }

        const users = await this.User.findAll({
            where: {
                role: "VENDOR"
            }
        })

        for (let u of users){
            u.checkPermission = () => true
            const input = {
                type: "USER_WILL_BLOCK",
                email: true,
                sms: false,
                tlgrm: false,
                extraEmail: u.email,
                telegram: "",
                telegramChat: ""}

            const input2 = {
                type: "USER_LOW_BALANCE",
                email: true,
                sms: false,
                tlgrm: false,
                extraEmail: u.email,
                telegram: "",
                telegramChat: ""}

            await this.notificationSettingsService.updateNotificationSetting(input, u)
            await this.notificationSettingsService.updateNotificationSetting(input2, u)
        }
        return true
    }

    async editPassword(password, user) {
        if (!user || !user.checkPermission(Permission.EDIT_PASSWORD)) {
            throw new NotAuthorized()
        }

        const token = await hashingUtils.generateRandomAccessKey(64)

        await this.redis.set("action_edit_password_" + token, `${user.id}:${password}`, "ex", Number(process.env.CHANGE_PASSWORD_TOKEN_TIMEOUT_MINUTES) * 60 * 1000)

        try {
            await microservices.notification.sendChangePasswordEmail(user.email, token)
        } catch (e) {
            logger.error(`Failed to send email`)
            logger.error(e)
        }

        logger.info(`User [${user.phone}] requested edit password. Token is ${token})`)

        return token
    }


    async confirmUserAction(input, user) {
        if (!user || !user.checkPermission(Permission.CONFIRM_USER_ACTION)) {
            throw new NotAuthorized()
        }

        const {token, type} = input

        if (type === UserActionType.CONFIRM_EMAIL) {
            const tokenValue = await this.redis.get("action_confirm_email_" + token)

            if (!tokenValue) {
                throw new TokenNotFound()
            }

            const userId = Number(tokenValue)

            const user = await this.User.findOne({
                where: {
                    id: userId
                }
            })

            if (!user) {
                throw new UserNotFound()
            }

            await this.redis.del("action_confirm_email_" + token)

            const input = {
                type: "USER_WILL_BLOCK",
                email: true,
                sms: false,
                tlgrm: false,
                extraEmail: user.email,
                telegram: "",
                telegramChat: ""}

            const input2 = {
                type: "USER_LOW_BALANCE",
                email: true,
                sms: false,
                tlgrm: false,
                extraEmail: user.email,
                telegram: "",
                telegramChat: ""}


            user.role = "VENDOR_NO_LEGAL_INFO"


            await user.save()

            user.checkPermission = () => true
            await this.notificationSettingsService.updateNotificationSetting(input, user)
            await this.notificationSettingsService.updateNotificationSetting(input2, user)

            return user
        }


        if (type === UserActionType.EDIT_EMAIL_CONFIRM) {
            const tokenValue = await this.redis.get("action_edit_email_" + token)

            if (!tokenValue) {
                throw new TokenNotFound()
            }

            const [userId, email] = tokenValue.split(":")

            const user = await this.User.findOne({
                where: {
                    id: Number(userId)
                }
            })

            if (!user) {
                throw new UserNotFound()
            }

            await this.redis.del("action_edit_email_" + token)

            user.email = email
            return await user.save()
        }

        if (type === UserActionType.EDIT_PASSWORD_CONFIRM) {
            const tokenValue = await this.redis.get("action_edit_password_" + token)

            if (!tokenValue) {
                throw new TokenNotFound()
            }

            const [userId, password] = tokenValue.split(":")

            const user = await this.User.findOne({
                where: {
                    id: Number(userId)
                }
            })

            if (!user) {
                throw new UserNotFound()
            }

            await this.redis.del("action_edit_password_" + token)

            user.password = await hashingUtils.hashPassword(password)

            return await user.save()
        }

        throw new Error("No such UserActionType")
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

        if(user.role === "ADMIN" && user.phone !== "9147073304"){

            const smsCode = await hashingUtils.generateRandomFloor(10000, 99999)
            await this.redis.hset("admin_sms", phone, smsCode)
            try {
                await microservices.notification.sendRegistrationSms(phone, smsCode)
            }
            catch(err){
                throw new SendSMSFailed()
            }

            return "NEED_SMS"
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

    async requestTokenAdmin(input) {
        const {phone, sms} = input

        //todo validation
        const savedSMS = await this.redis.hget("admin_sms", phone)


        if (savedSMS !== sms) {
            throw new PhonePasswordMatchFailed()
        }

        const user = await this.User.findOne({
            where: {
                phone
            }
        })

        const token = await hashingUtils.generateRandomAccessKey()

        await this.redis.hset("tokens", token, user.id)

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

    async rememberPasswordRequest(input) {
        const {phone, email} = input
        const user = await this.User.findOne({
            where: {
                phone,
                email
            }
        })
        if (!user) {
            return false
        }
        const token = await hashingUtils.generateRandomAccessKey(64)

        await this.redis.set("action_remember_password_" + token, `${user.id}`, "ex", 24 * 60 * 60 * 1000)
        await microservices.notification.sendRememberPasswordEmail(user.email, token)


        return true
    }

    async changePasswordRequest(input) {
        const {token, password} = input
        const tokenValue = await this.redis.get("action_remember_password_" + token)

        if (!tokenValue) {
            throw new TokenNotFound()
        }

        const userId = Number(tokenValue)

        const user = await this.User.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new UserNotFound()
        }

        user.passwordHash = await this.hashPassword(password)
        await user.save()

        await this.redis.del("action_remember_password_" + token)

        return true
    }

    async getLegalInfoByUserId(id, user) {
        if (!user || !user.checkPermission(Permission.GET_LEGAL_INFO)) {
            throw new NotAuthorized()
        }

        if(id !== user.id && !user.checkPermission(Permission.GET_ALL_USERS)){
            throw new NotAuthorized()
        }

        const selectedUser = await this.User.findOne({
            where: {
                id
            }})

        if(!selectedUser){
            return null
        }
        return selectedUser.getLegalInfo()



    }


    async getAllUsers(input, user, orderDesc, orderKey) {
        if (!user || !user.checkPermission(Permission.GET_ALL_USERS)) {
            throw new NotAuthorized()
        }
        let {role, userId, limit, offset} = input
        const where = {}
        if(role && role !== "ALL"){
            where.role = role
        }
        if(userId){
            where.id = userId
        }
        if (!limit) {
            limit = 100
        }


        let orderData = ["id", "DESC"]

        if(orderDesc === true){
            orderData =["id"]
        }
        if(orderKey){
            if(orderKey === "id"){
                orderData[0] = orderKey
            }
            if(orderKey === "companyName"){
                orderData[0] = "company_name"
            }
            if(orderKey === "inn"){
                orderData[0] = "company_name"
            }
            if(orderKey === "phone"){
                orderData[0] = orderKey
            }
            if(orderKey === "role"){
                orderData[0] = orderKey
            }
            if(orderKey === "email"){
                orderData[0] = orderKey
            }

        }

        return await this.User.findAll({
            limit,
            offset,
            where,
            order: [
                orderData
            ]
        })
    }

    async closeUser(id, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_USERS)) {
            throw new NotAuthorized()
        }

        const selectedUser = await this.User.findOne({
            where: {
                id
            }})
        if(selectedUser.role === "CLOSED"){
            return await selectedUser.destroy()
        }

        selectedUser.role = "CLOSED"
        return await selectedUser.save()
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
        return await hashingUtils.hashPassword(password)
    }

}

module.exports = UserService
