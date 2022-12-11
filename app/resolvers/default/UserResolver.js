const NotificationType = require("../../enum/NotificationType")
const NotificationDTO = require("../../models/dto/NotificationDTO")
const ItemDTO = require("../../models/dto/ItemDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const BillingDTO = require("../../models/dto/BillingDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")
const FastSummaryDTO = require("../../models/dto/FastSummaryDTO")
const KktDTO = require("../../models/dto/KktDTO")
const UserDTO = require("../../models/dto/UserDTO")
const ControllerDTO = require("../../models/dto/ControllerDTO")

function UserResolver({controllerService, notificationSettingsService, itemService, saleService, kktService, userService, partnerService}) {

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
        const {id} = obj

        const kkts = await kktService.getUserKkts(user, id)

        return kkts.map(kkt => (new KktDTO(kkt)))
    }

    const monthPay = async (obj, args, context) => {
        const {user} = context
        const {id} = obj
        const {period} = args

        return await userService.monthPay(user, id, period)
    }

    const partnerFee = async (obj, args, context) => {
        const {user} = context
        const {id} = obj
        const {period, role} = args

        return await partnerService.getUserPartnerFee(id, period, user, role)
    }

    const vendors = async (obj, args, context) => {
        const {user} = context
        const {id} = obj

        const vendors = await partnerService.getPartnerVendors(id, user)

        return vendors.map(vendor => new UserDTO(vendor))
    }

    const controllers = async (obj, args, context) => {
        const {user} = context
        const {id} = obj

        const controllers = await controllerService.getAllOfCurrentUser(user, id)

        return controllers.map(controller => (new ControllerDTO(controller)))
    }


    const billing = async (obj, args) => {
        const {userId} = args
        if(userId){
            return new BillingDTO({userId})
        }
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
        fastSummary,
        controllers,
        monthPay,
        partnerFee,
        vendors
    }

}

module.exports = UserResolver

