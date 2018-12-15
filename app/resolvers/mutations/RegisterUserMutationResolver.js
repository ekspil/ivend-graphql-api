function RegisterUserMutationResolver(userService) {
    return async (root, args) => {
        const {email, password} = args;

        const user = await userService.registerUser(email, password)

        return {
            email: user.email,
            phone: user.phone
        }

    }
}

module.exports = RegisterUserMutationResolver

