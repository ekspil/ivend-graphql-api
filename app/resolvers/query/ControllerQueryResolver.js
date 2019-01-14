function ControllerQueryResolver(controllerService) {
    return async (obj, args, context) => {
        const { uid } = args
        const { user } = context

        const controller = await controllerService.getControllerByUID(uid, user)


        if (controller) {
            const { mode, accessKey } = controller

            return {
                uid: controller.uid,
                mode,
                accessKey
            }
        }

        return null
    }
}


module.exports = ControllerQueryResolver
