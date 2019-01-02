function AuthControllerMutationResolver(controllerService) {
    return async (root, args, context) => {
        const {uid} = args;
        const {user} = context

        return await controllerService.generateAccessKey(uid, user)

    }
}

module.exports = AuthControllerMutationResolver

