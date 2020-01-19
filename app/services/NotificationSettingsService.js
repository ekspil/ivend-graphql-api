const NotAuthorized = require("../errors/NotAuthorized")
const NotificationSetting = require("../models/NotificationSetting")
const Permission = require("../enum/Permission")

class NotificationSettingsService {

    constructor({NotificationSettingModel}) {
        this.NotificationSetting = NotificationSettingModel

        this.findAll = this.findAll.bind(this)
        this.findByType = this.findByType.bind(this)
        this.updateNotificationSetting = this.updateNotificationSetting.bind(this)
        this.insertTelegramToNotificationSetting = this.insertTelegramToNotificationSetting.bind(this)
    }


    createNotificationSetting(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NOTIFICATION_SETTING)) {
            throw new NotAuthorized()
        }

        const {type} = input

        const notificationSetting = new NotificationSetting()

        notificationSetting.type = type
        notificationSetting.email = false
        notificationSetting.sms = false
        notificationSetting.tlgrm = false
        notificationSetting.extraEmail = ""
        notificationSetting.telegram = ""
        notificationSetting.telegramChat = ""
        notificationSetting.user_id = user.id

        return this.NotificationSetting.create(notificationSetting)
    }

    async findAll(user) {
        if (!user || !user.checkPermission(Permission.FIND_ALL_NOTIFICATION_SETTINGS)) {
            throw new NotAuthorized()
        }

        return await this.NotificationSetting.findAll({
            where: {
                user_id: user.id
            }
        })
    }

    async findByType(type, user) {
        if (!user || !user.checkPermission(Permission.FIND_NOTIFICATION_SETTING_BY_TYPE)) {
            throw new NotAuthorized()
        }

        return await this.NotificationSetting.findOne({
            where: {
                user_id: user.id,
                type
            }
        })
    }

    async updateNotificationSetting(input, user) {
        if (!user || !user.checkPermission(Permission.UPDATE_NOTIFICATION_SETTING)) {
            throw new NotAuthorized()
        }

        const {type, email, sms, tlgrm, extraEmail, telegram, telegramChat} = input

        const checkNotificationSetting = await this.findByType(type, user)

        if (!checkNotificationSetting) {
            await this.createNotificationSetting(input, user)
        }
        const notificationSetting = await this.findByType(type, user)

        notificationSetting.email = email
        notificationSetting.sms = sms
        notificationSetting.tlgrm = tlgrm
        notificationSetting.extraEmail = extraEmail
        notificationSetting.telegram = telegram
        notificationSetting.telegramChat = telegramChat

        return await notificationSetting.save()
    }

    async insertTelegramToNotificationSetting(input, user) {
        if (!user || !user.checkPermission(Permission.ADD_TELEGRAMCHAT_NOTIFICATION_SETTING)) {
            throw new NotAuthorized()
        }

        const {telegram, telegramChat} = input

        const where = {
            telegram
        }
        const data = {
            telegramChat
        }

        const result = await this.NotificationSetting.update(data, {where})
        if (result[0] > 0) {
            return true
        }

        return false

    }
}

module.exports = NotificationSettingsService
