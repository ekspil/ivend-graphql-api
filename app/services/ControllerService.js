const NotAuthorized = require("../errors/NotAuthorized")

class ControllerService {

    constructor(controllerRepository) {
        this.controllerRepository = controllerRepository

        this.getControllerByUID = this.getControllerByUID.bind(this)
    }


    async getControllerByUID(uid, user) {
        if (!user) {
            throw new NotAuthorized();
        }

        //todo validation UID

        return await this.controllerRepository.findOne({uid: uid})
    }

}

module.exports = ControllerService
