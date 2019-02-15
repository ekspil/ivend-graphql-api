function UserMutations({ userService }) {

    const registerUser = async (root, args) => {
        const { input } = args

        const user = await userService.registerUser(input)

        return {
            email: user.email,
            phone: user.phone
        }

    }

    return { registerUser }

}

module.exports = UserMutations

