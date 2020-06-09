const UserDTO = require("../../models/dto/UserDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const UserNotFound = require("../../errors/UserNotFound")

function UserQueries({userService}) {

    const getProfile = async (root, args, context) => {
        const user = await userService.getProfile(context.user)

        if (!user) {
            throw new UserNotFound()
        }

        return new UserDTO(user)
    }

    const getAllUsers = async (root, args, context) => {
        const {input} = args
        const users = await userService.getAllUsers(input, context.user)

        return users.map(user => (new UserDTO(user)))
    }

    const getLegalInfoByUserId = async (root, args, context) => {
        const {user} = context
        const {id} = args
        const legalInfo = await userService.getLegalInfoByUserId(id, user)

        if (!legalInfo) {
            return null
        }

        return new LegalInfoDTO(legalInfo)
    }

    return {
        getProfile,
        getAllUsers,
        getLegalInfoByUserId
    }

}

module.exports = UserQueries

