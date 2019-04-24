const NotificationDTO = require("../../models/dto/NotificationDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const ExcelReportDTO = require("../../models/dto/ExcelReportDTO")
const UserDTO = require("../../models/dto/UserDTO")

function UserMutations({userService, notificationSettingsService, legalInfoService, reportService}) {

    const registerUser = async (root, args) => {
        const {input} = args

        const user = await userService.registerUser(input)

        return {
            email: user.email,
            phone: user.phone
        }

    }

    const requestToken = async (root, args) => {
        const {input} = args

        return await userService.requestToken(input)
    }

    const updateNotificationSetting = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const notificationSetting = await notificationSettingsService.updateNotificationSetting(input, user)

        return new NotificationDTO(notificationSetting)
    }


    const updateLegalInfo = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const legalInfo = await legalInfoService.updateLegalInfo(input, user)

        return new LegalInfoDTO(legalInfo)
    }


    const generateExcel = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const excelReport = await reportService.generateExcel(input, user)

        return new ExcelReportDTO(excelReport)
    }


    const requestRegistrationSms = async (root, args, context) => {
        const {input} = args
        const {user} = context

        return await userService.requestRegistrationSms(input, user)
    }

    const editEmail = async (root, args, context) => {
        const {email} = args
        const {user} = context

        await userService.editEmail(email, user)

        return true
    }

    const confirmUserAction = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const newUser = await userService.confirmUserAction(input, user)

        return new UserDTO(newUser)
    }

    return {
        registerUser,
        editEmail,
        requestToken,
        confirmUserAction,
        updateNotificationSetting,
        updateLegalInfo,
        generateExcel,
        requestRegistrationSms
    }

}

module.exports = UserMutations

