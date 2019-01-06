function ControllerMutations({controllerService}) {

    const createController = async (root, args, context) => {
        const {uid, mode} = args;
        const {user} = context

        const controller = await controllerService.createController(uid, mode, user)

        return {
            uid: controller.uid,
            mode: controller.mode
        }

    }

    return {
        createController
    }

}

module.exports = ControllerMutations

