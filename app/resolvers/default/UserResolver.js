const NotificationType = require("../../enum/NotificationType")
const NotificationDTO = require("../../models/dto/NotificationDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const DepositDTO = require("../../models/dto/DepositDTO")

function ControllerResolver({notificationSettingsService, legalInfoService, billingService}) {

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

    const balance = async (obj, args, context) => {
        const {user} = context

        return await billingService.getBalance(user)
    }

    const deposits = async (obj, args, context) => {
        const {user} = context

        const deposits = await billingService.getDeposits(user)

        return deposits.map(deposit => (new DepositDTO({
            id: deposit.id,
            amount: deposit.amount,
            status: deposit.paymentRequest.status,
            redirectUrl: deposit.paymentRequest.redirectUrl
        })))
    }

    return {
        notificationSettings,
        legalInfo,
        balance,
        deposits
    }

}

module.exports = ControllerResolver

