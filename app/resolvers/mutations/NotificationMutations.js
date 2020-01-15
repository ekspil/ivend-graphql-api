const NotificationDTO = require("../../models/dto/NotificationDTO")

function NotificationMutations({notificationSettingsService}) {

    const createNotificationSetting = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const notification = await notificationSettingsService.createNotificationSetting(input, user)

        return new NotificationDTO(notification)
    }

    const insertTelegramToNotificationSetting = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const notification = await notificationSettingsService.insertTelegramToNotificationSetting(input, user)

        return notification
    }

    return {
        createNotificationSetting,
        insertTelegramToNotificationSetting
    }

}

module.exports = NotificationMutations

