function RegisterUserMutationResolver(controllerService) {
    return async (root, args, context) => {
        const {uid, mode} = args;
        const {user} = context

        const controller = await controllerService.createController(uid, mode, user)

        return {
            uid: controller.uid,
            mode: controller.mode
        }

    }
}

module.exports = RegisterUserMutationResolver

