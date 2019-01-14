function ControllersQueryResolver(controllerService) {
    return async (obj, args, context) => {
        const { user } = context

        const controllers = await controllerService.getAll(user)

        return controllers.map(controller => {

            const { uid, mode } = controller

            return {
                uid,
                mode
            }
        })
    }
}


module.exports = ControllersQueryResolver
