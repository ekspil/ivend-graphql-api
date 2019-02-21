const UserDTO = require("../../models/dto/UserDTO")

function UserQueries({userService}) {

    const getProfile = async (root, args, context) => {
        const user = await userService.getProfile(context.user)

        if (!user) {
            throw new Error("User not found")
        }

        return new UserDTO(user)
    }

    return {
        getProfile
    }

}

module.exports = UserQueries

