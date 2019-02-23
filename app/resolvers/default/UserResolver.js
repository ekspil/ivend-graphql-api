const NotificationType = require("../../enum/NotificationType")
const NotificationDTO = require("../../models/dto/NotificationDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")

function ControllerResolver({notificationSettingsService, legalInfoService}) {

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

    const legalInfo = async (obj, args, context) => {
        const {user} = context

        const legalInfo = await user.getLegalInfo()

        if (!legalInfo) {
            return null
        }

        return new LegalInfoDTO(legalInfo)
    }

    return {
        notificationSettings,
        legalInfo
    }

}

module.exports = ControllerResolver

