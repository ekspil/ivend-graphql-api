


class ControllerIntegrationDTO {

    constructor({id, imei, controllerId, controllerUid, type}) {
        this.id = id
        this.type = type
        this.imei = imei
        this.controllerId = controllerId
        this.controllerUid = controllerUid
    }
}

module.exports = ControllerIntegrationDTO
