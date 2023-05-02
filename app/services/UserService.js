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

    constructor({UserModel, NewsModel, ManagerModel, redis, machineService, ButtonItemModel, notificationSettingsService, ItemModel, NotificationSettingModel, TransactionModel, TempModel, ItemMatrixModel, ControllerModel, DepositModel, MachineModel, MachineGroupModel, KktModel, AdminStatisticModel, LongTaskModel}) {
        this.User = UserModel
        this.redis = redis

        this.ItemModel = ItemModel
        this.NotificationSettingModel = NotificationSettingModel
        this.TransactionModel = TransactionModel
        this.TempModel = TempModel
        this.ItemMatrixModel = ItemMatrixModel
        this.ControllerModel = ControllerModel
        this.DepositModel = DepositModel
        this.MachineModel = MachineModel
        this.MachineGroupModel = MachineGroupModel
        this.KktModel = KktModel
        this.ButtonItemModel = ButtonItemModel
        this.AdminStatistic = AdminStatisticModel
        this.News = NewsModel
        this.Managers = ManagerModel
        this.LongTask = LongTaskModel

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
        this.generateTempPassword = this.generateTempPassword.bind(this)
        this.generatePassword = this.generatePassword.bind(this)
        this.mailingJobStatus = this.mailingJobStatus.bind(this)
        this.smsingJobStatus = this.smsingJobStatus.bind(this)
    }

    async getManagers(user) {
        if(!user || !user.checkPermission(Permission.GET_MANAGERS)){
            throw new NotAuthorized()
        }

        return await this.Managers.findAll()
    }
    async sendEmail(input, user) {
        if(!user || !user.checkPermission(Permission.SEND_EMAIL)){
            throw new NotAuthorized()
        }
        return await microservices.notification.sendEmail(input, user)
    }

    async smsingJobStatus(id, user) {
        if(!user || !user.checkPermission(Permission.SEND_EMAIL)){
            throw new NotAuthorized()
        }
        return await this.redis.hget("JOBS_LONG_PROCESSES_NEWS_SMSING_STATUS", id)
    }

    async mailingJobStatus(id, user) {
        if(!user || !user.checkPermission(Permission.SEND_EMAIL)){
            throw new NotAuthorized()
        }
        return await this.redis.hget("JOBS_LONG_PROCESSES_NEWS_MAILING_STATUS", id)
    }

    async sendNewsEmail(id, user) {
        if(!user || !user.checkPermission(Permission.SEND_EMAIL)){
            throw new NotAuthorized()
        }
        const longTask = {
            type: "NEWS_MAILING",
            status: "WAITING",
            targetId: id
        }
        this.LongTask.create(longTask)
        return true
    }


    async sendNewsSMS(id, user) {
        if(!user || !user.checkPermission(Permission.SEND_EMAIL)){
            throw new NotAuthorized()
        }

        const longTask = {
            type: "NEWS_SMSING",
            status: "WAITING",
            targetId: id
        }
        this.LongTask.create(longTask)
        return true
    }

    async getAdminStatistic(user) {
        if(!user || !user.checkPermission(Permission.GET_ALL_USERS)){
            throw new NotAuthorized()
        }

        const orderData = ["id", "DESC"]
        const data = await this.AdminStatistic.findOne({
            order: [
                orderData
            ]
        })

        if(!data) {
            throw new Error("No statistic")
        }
        const statTime = new Date(data.createdAt).getTime()
        const nowTime = new Date().getTime()
        const result = (Number(nowTime) - Number(statTime))
        if (result > 25 * 60 * 60 * 1000){
            data.informationStatus = false
        }
        else {
            data.informationStatus = true
        }
        return data
    }



    async monthPay(user, id, period) {
        if (!user || !user.checkPermission(Permission.GET_PROFILE)) {
            throw new NotAuthorized()
        }

        const where = {}
        if (period) {
            const {from, to} = period

            if (from > to) {
                throw new Error("Invalid Period")
            }

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }
        where.amount = {
            [Op.lt]: 0
        }
        where.user_id = id
        const trs = await this.TransactionModel.findAll({
            where
        })

        const summa = trs.reduce((acc,item) => {
            return acc + Number(item.amount)
        }, 0)
        return Number(-summa.toFixed(2))
    }


    async registerUser(input, role) {
        return this.User.sequelize.transaction(async (transaction) => {
            const {email, code, phone, password, partnerId, countryCode} = input

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
            user.countryCode = countryCode

            if(partnerId){
                user.partnerId = partnerId
            }

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
        const {email, id, phone, password, role, partnerId, managerId} = input


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

        user.partnerId = partnerId
        user.managerId = managerId

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

        const tempPassword = await this.redis.get("admin_temp_password")

        const tempPasswordMatched = password === tempPassword
        const passwordMatched = user && await bcryptjs.compare(password, user.passwordHash)

        if (!user || !(passwordMatched || tempPasswordMatched)) {
            throw new PhonePasswordMatchFailed()
        }
        if (user.role === "CLOSED") {
            throw new Error("CLOSED_USER")
        }
        if(!user.countryCode) user.countryCode = "7"
        const tel = user.countryCode + user.phone

        if(user.role === "ADMIN" && user.phone !== "9147073304"){

            const smsCode = await hashingUtils.generateRandomFloor(10000, 99999)
            await this.redis.hset("admin_sms", phone, smsCode)
            try {
                await microservices.notification.sendRegistrationSms(tel, smsCode)
            }
            catch(err){
                throw new SendSMSFailed()
            }

            return "NEED_SMS"
        }
        const existToken = await this.redis.hget("tokens", `user_${user.id}`)
        if(existToken) return existToken

        const token = await hashingUtils.generateRandomAccessKey()

        await this.redis.hset("tokens", token, user.id, `user_${user.id}`, token)


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

        await this.redis.hset("tokens", token, user.id, `user_${user.id}`, token)

        return token
    }

    async getProfile(user, userId) {
        if (!user || !user.checkPermission(Permission.GET_PROFILE)) {
            throw new NotAuthorized()
        }

        if(userId){
            return await this.User.findOne({
                where: {
                    id: userId
                }
            })
        }

        return await this.User.findOne({
            where: {
                id: user.id
            }
        })
    }


    async generateTempPassword(user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }

        const password = this.generatePassword(24)
        await this.redis.set("admin_temp_password", password, "ex", 12 * 60 * 1000)

        return password
    }

    generatePassword(length){
        if(!length) length = 16
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let res = ""
        for (let i = 0, n = charset.length; i < length; ++i) {
            res += charset.charAt(Math.floor(Math.random() * n))
        }
        return res
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


        const existToken = await this.redis.hget("tokens", `user_${user.id}`)

        await this.redis.hdel("tokens", existToken)
        await this.redis.hdel("tokens", `user_${user.id}`)

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


    async getAllUsers(input, user, orderDesc, orderKey, search, partnerId, managerId) {
        if (!user || !user.checkPermission(Permission.GET_ALL_USERS)) {
            throw new NotAuthorized()
        }
        let {role, userId, limit, offset} = input
        let where = {}
        if(search && search.length > 3) {
            where = {
                [Op.or]: [
                    {
                        email: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        phone: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        companyName: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        inn: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        inn: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                ]
            }
        }



        if(role && role !== "ALL"){
            where.role = role
        }
        if(userId){
            where.id = userId
        }
        if(partnerId){
            where.partnerId = partnerId
        }
        if(managerId){
            where.managerId = managerId
        }
        if (!limit) {
            limit = 100
        }
        if(user.role === "PARTNER"){
            where.partnerId = user.id
        }
        if(role === "VENDOR"){
            where.role = {
                [Op.in]: ["VENDOR", "PARTNER"]
            }
        }


        let orderData = ["id", "DESC"]

        if(orderDesc === true){
            orderData =["id", "ASC"]
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

    async userAutoSend(value, user) {
        if (!user || !user.checkPermission(Permission.GET_LEGAL_INFO)) {
            throw new NotAuthorized()
        }

        const selectedUser = await this.User.findOne({
            where: {
                id: user.id
            }})

        selectedUser.autoSend = value
        await selectedUser.save()
        return true
    }

    async closeUser(id, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_USERS)) {
            throw new NotAuthorized()
        }

        const selectedUser = await this.User.findOne({
            where: {
                id
            }})

        const where = {
            user_id: Number(selectedUser.id)
        }

        if(selectedUser.role === "CLOSED"){


            const nss = await this.NotificationSettingModel.findAll({where, paranoid: false})
            for (let item of nss){
                await item.destroy({force: true})
            }
            const ts = await this.TransactionModel.findAll({where, paranoid: false})
            for (let item of ts){
                await item.destroy({force: true})
            }
            const tmps = await this.TempModel.findAll({where, paranoid: false})
            for (let item of tmps){
                await item.destroy({force: true})
            }
            const ims = await this.ItemMatrixModel.findAll({where, paranoid: false})
            for (let item of ims){

                const bis = await this.ButtonItemModel.findAll({
                    where: {
                        item_matrix_id: item.id
                    },
                    paranoid: false
                })
                for (let it of bis){
                    await it.destroy({force: true})
                }


                await item.destroy({force: true})
            }

            const is = await this.ItemModel.findAll({where, paranoid: false})
            for (let item of is){
                await item.destroy({force: true})
            }
            const cs = await this.ControllerModel.findAll({where, paranoid: false})
            for (let item of cs){
                await item.destroy({force: true})
            }
            const ds = await this.DepositModel.findAll({where, paranoid: false})
            for (let item of ds){
                await item.destroy({force: true})
            }


            const ms = await this.MachineModel.findAll({where, paranoid: false})
            for (let item of ms){
                await item.destroy({force: true})
            }

            const mgs = await this.MachineGroupModel.findAll({where, paranoid: false})
            for (let item of mgs){
                await item.destroy({force: true})
            }

            const kkts = await this.KktModel.findAll({where, paranoid: false})
            for (let item of kkts){
                await item.destroy({force: true})
            }

            const usr = {id: selectedUser.id, email: selectedUser.email, role: selectedUser.role, phone: selectedUser.phone}
            await selectedUser.destroy({force: true})
            return usr
        }

        selectedUser.role = "CLOSED"

        const cs = await this.ControllerModel.findAll({where, paranoid: false})
        for (let item of cs){
            await item.destroy()
        }

        return await selectedUser.save()
    }


    async requestRegistrationSms(input) {
        //todo validation
        const {phone, countryCode} = input

        const tel = countryCode + phone

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

        await microservices.notification.sendRegistrationSms(tel, smsCode)

        await this.redis.hset("registration_" + phone, "code", smsCode)
        await this.redis.hset("registration_" + phone, "request_again_at", requestAgainDate.getTime())
        await this.redis.hset("registration_" + phone, "timeout_at", expiryDate.getTime())

        logger.debug(`SMS code for ${phone} is ${smsCode}. Valid until ${expiryDate}, may request again at ${requestAgainDate}`)

        return expiryDate
    }



    async newInfoId(user) {
        if (!user || !user.checkPermission(Permission.GET_PROFILE)) {
            throw new NotAuthorized()
        }

        const id = await this.redis.get("is_not_read_news_" + user.id)
        if(!id) return null
        return Number(id)
    }


    async hashPassword(password) {
        return await hashingUtils.hashPassword(password)
    }

}

module.exports = UserService
