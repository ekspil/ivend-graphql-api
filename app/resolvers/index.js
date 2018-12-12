const ControllerRepository = require("../repositories/ControllerRepository")
const controllerRepository = new ControllerRepository()

const controller = require("./ControllerResolver")(controllerRepository)

module.exports = {
    Query: {
        controller
    },
}
