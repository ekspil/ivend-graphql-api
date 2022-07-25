


class ControllerIntegrationDTO {

    constructor({id, imei, controllerId, controllerUid, type, serial, userId}) {
        this.id = id
        this.type = type
        this.imei = imei
        this.controllerId = controllerId
        this.controllerUid = controllerUid
        this.serial = serial
        this.userId = userId
    }
}

module.exports = ControllerIntegrationDTO
