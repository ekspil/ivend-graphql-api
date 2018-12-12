const Controller = require("../models/Controller")
const ControllerModel = require("../models/mongoose/models/ControllerModel")

class ControllerRepository {

    constructor(mongo) {
    }

    async getControllerByUID(uid) {
        const query = ControllerModel
            .find({
                uid: uid
            })

        const controller = await query.findOne().exec()

        if (!controller) {
            return null
        }

        return new Controller(controller)
    }
}

module.exports = ControllerRepository
