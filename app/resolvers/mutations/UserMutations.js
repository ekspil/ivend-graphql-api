function UserMutations({userService}) {

    const registerUser = async (root, args) => {
        const {email, password} = args;

        const user = await userService.registerUser(email, password)

        return {
            email: user.email,
            phone: user.phone
        }

    }

    return {registerUser}

}

module.exports = UserMutations

