const NotificationDTO = require("../../models/dto/NotificationDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const ExcelReportDTO = require("../../models/dto/ExcelReportDTO")
const PdfReportDTO = require("../../models/dto/PdfReportDTO")
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


    const sendEmail = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        return await userService.sendEmail(input, user)

    }

    const randomAction = async (parent, args, context)=>{
        const {user} = context

        return await userService.randomAction(user)

    }


    const requestToken = async (root, args) => {
        const {input} = args

        return await userService.requestToken(input)
    }

    const requestTokenAdmin = async (root, args) => {
        const {input} = args

        return await userService.requestTokenAdmin(input)
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

    const updateLegalInfoToUser = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const legalInfo = await legalInfoService.updateLegalInfoToUser(input, user)

        return new LegalInfoDTO(legalInfo)
    }

    const closeUser = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const closedUser = await userService.closeUser(id, user)

        return new UserDTO(closedUser)
    }
    const updateUser = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const updatedUser = await userService.updateUser(input, user)

        return new UserDTO(updatedUser)
    }


    const generateExcel = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const excelReport = await reportService.generateExcel(input, user)

        return new ExcelReportDTO(excelReport)
    }

    const generatePdf = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const pdf = await reportService.generatePdf(input, user)

        return new PdfReportDTO(pdf)
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

    const editPassword = async (root, args, context) => {
        const {email} = args
        const {user} = context

        await userService.editPassword(email, user)

        return true
    }

    const confirmUserAction = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const newUser = await userService.confirmUserAction(input, user)

        return new UserDTO(newUser)
    }

    const rememberPasswordRequest = async (root, args) => {
        const {input} = args

        const answer = await userService.rememberPasswordRequest(input)

        return answer
    }
    const changePasswordRequest = async (root, args) => {
        const {input} = args

        const answer = await userService.changePasswordRequest(input)

        return answer
    }



    return {
        registerUser,
        editEmail,
        requestToken,
        requestTokenAdmin,
        editPassword,
        confirmUserAction,
        updateNotificationSetting,
        updateLegalInfo,
        generateExcel,
        generatePdf,
        requestRegistrationSms,
        rememberPasswordRequest,
        changePasswordRequest,
        sendEmail,
        closeUser,
        updateLegalInfoToUser,
        updateUser,
        randomAction
    }

}

module.exports = UserMutations

