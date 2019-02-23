const NotificationDTO = require("../../models/dto/NotificationDTO")

function UserMutations({userService, notificationSettingsService}) {

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

    return {registerUser, requestToken, updateNotificationSetting}

}

module.exports = UserMutations

