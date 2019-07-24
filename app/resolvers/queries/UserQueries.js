const UserDTO = require("../../models/dto/UserDTO")
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
        const users = await userService.getAllUsers(context.user)

        if (!users) {
            throw new UserNotFound()
        }

        return users.map(user => (new UserDTO(user)))
    }

    return {
        getProfile,
        getAllUsers
    }

}

module.exports = UserQueries

