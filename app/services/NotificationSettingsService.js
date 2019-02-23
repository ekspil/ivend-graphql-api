const NotAuthorized = require("../errors/NotAuthorized")
const NotificationSetting = require("../models/NotificationSetting")
const Permission = require("../enum/Permission")

class NotificationSettingsService {

    constructor({NotificationSettingModel}) {
        this.NotificationSetting = NotificationSettingModel

        this.findAll = this.findAll.bind(this)
        this.findByType = this.findByType.bind(this)
        this.updateNotificationSetting = this.updateNotificationSetting.bind(this)
    }


    createNotificationSetting(input, user) {
        if (!user || !user.checkPermission(Permission.READ_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const {type, email, sms} = input

        const notificationSetting = new NotificationSetting()

        notificationSetting.type = type
        notificationSetting.email = email
        notificationSetting.sms = sms
        notificationSetting.user_id = user.id

        return this.NotificationSetting.create(notificationSetting)
    }

    async findAll(user) {
        if (!user || !user.checkPermission(Permission.READ_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        return await this.NotificationSetting.findAll({
            where: {
                user_id: user.id
            }
        })
    }

    async findByType(type, user) {
        if (!user || !user.checkPermission(Permission.READ_EQUIPMENT)) {
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
        if (!user || !user.checkPermission(Permission.READ_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const {type, email, sms} = input

        const notificationSetting = await this.findByType(type, user)

        if (!notificationSetting) {
            return await this.createNotificationSetting(input, user)
        }

        notificationSetting.email = email
        notificationSetting.sms = sms

        return await notificationSetting.save()
    }
}

module.exports = NotificationSettingsService
