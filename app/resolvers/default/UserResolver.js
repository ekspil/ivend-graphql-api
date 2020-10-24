const NotificationType = require("../../enum/NotificationType")
const NotificationDTO = require("../../models/dto/NotificationDTO")
const ItemDTO = require("../../models/dto/ItemDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const BillingDTO = require("../../models/dto/BillingDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")
const FastSummaryDTO = require("../../models/dto/FastSummaryDTO")
const KktDTO = require("../../models/dto/KktDTO")

function UserResolver({notificationSettingsService, itemService, saleService, kktService, userService}) {

    const notificationSettings = async (obj, args, context) => {
        const {user} = context

        const notificationSettings = await notificationSettingsService.findAll(user)

        return Object
            .keys(NotificationType)
            .map(notificationType => {
                const [notificationSetting] = notificationSettings.filter(notificationSetting => notificationSetting.type === notificationType)

                if (notificationSetting) {
                    const {type, email, sms, tlgrm, extraEmail, telegram, telegramChat} = notificationSetting
                    return new NotificationDTO({type, email, sms, tlgrm, extraEmail, telegram, telegramChat})
                }

                return new NotificationDTO({type: notificationType, email: false, sms: false, tlgrm: false})
            })
    }

    const legalInfo = async (obj, args, context) => {
        const {user} = context

        const legalInfo = await userService.getLegalInfoByUserId(obj.id, user)
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

    const billing = async (obj) => {
        return new BillingDTO({userId: obj.id})
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

    const fastSummary = async (obj, args, context) => {
        const {user} = context

        const fastSummary = await saleService.getFastSummary(user)

        if (!fastSummary) {
            return null
        }

        return new FastSummaryDTO(fastSummary)
    }

    return {
        notificationSettings,
        legalInfo,
        billing,
        items,
        salesSummary,
        kkts,
        fastSummary
    }

}

module.exports = UserResolver

