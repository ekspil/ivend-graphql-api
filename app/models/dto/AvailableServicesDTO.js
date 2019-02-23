const ServiceDTO = require("./ServiceDTO")

class AvailableServicesDTO {

    constructor({controller}) {
        this.controller = controller ? controller.map(controllerService => (new ServiceDTO(controllerService))) : null
    }
}

module.exports = AvailableServicesDTO
