
function controllerResolver(controllerRepository) {
    /**
     *
     * @param controllerRepository
     * @returns {function<Promise<Controller>>}
     */
    return async (parent, args) => {
        const {uid} = args

        return await controllerRepository.getControllerByUID(uid)
    }
}


module.exports = controllerResolver