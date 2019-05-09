const NotificationType = require("../../enum/NotificationType")
const NotificationDTO = require("../../models/dto/NotificationDTO")
const ItemDTO = require("../../models/dto/ItemDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const BillingDTO = require("../../models/dto/BillingDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")
const KktDTO = require("../../models/dto/KktDTO")

function UserResolver({notificationSettingsService, itemService, saleService}) {

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

    const items = async (obj, args, context) => {
        const {user} = context

        const items = await itemService.getUserItems(user)

        return items.map(item => (new ItemDTO(item)))
    }

    const kkts = async (obj, args, context) => {
        const {user} = context

        const kkts = await kktService.getUserKkts(user)

        return kkts.map(kkt => (new KktDTO(kkt)))
    }

    const billing = async () => {
        return new BillingDTO({})
    }

    const salesSummary = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const salesSummary = await saleService.getSalesSummary({period}, user)

        if (!salesSummary) {
            return null
        }

        return new SalesSummaryDTO(salesSummary)
    }

    return {
        notificationSettings,
        legalInfo,
        billing,
        items,
        salesSummary,
        kkts
    }

}

module.exports = UserResolver

