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

    return {
        getProfile
    }

}

module.exports = UserQueries

