const NotificationType = require("../../enum/NotificationType")
const NotificationDTO = require("../../models/dto/NotificationDTO")

function ControllerResolver({notificationSettingsService}) {

    const notificationSettings = async (obj, args, context) => {
        const {user} = context

        const notificationSettings = await notificationSettingsService.findAll(user)

        return Object
            .keys(NotificationType)
            .map(notificationType => {
                const [notificationSetting] = notificationSettings.filter(notificationSetting => notificationSetting.type === notificationType)

                if (notificationSetting) {
                    const {type, email, sms} = notificationSetting
                    return new NotificationDTO({type, email, sms})
                }

                return new NotificationDTO({type: notificationType, email: false, sms: false})
            })
    }

    return {
        notificationSettings
    }

}

module.exports = ControllerResolver

