const NotificationDTO = require("../../models/dto/NotificationDTO")

function NotificationMutations({notificationSettingsService}) {

    const createNotificationSetting = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const notification = await notificationSettingsService.createNotificationSetting(input, user)

        return new NotificationDTO(notification)
    }

    return {
        createNotificationSetting
    }

}

module.exports = NotificationMutations

