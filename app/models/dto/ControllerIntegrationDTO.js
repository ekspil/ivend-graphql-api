


class ControllerIntegrationDTO {

    constructor({id, imei, controllerId, controllerUid, type, serial, userId, user}) {
        this.id = id
        this.type = type
        this.imei = imei
        this.controllerId = controllerId
        this.controllerUid = controllerUid
        this.serial = serial
        this.userId = userId
        this.user = user
    }
}

module.exports = ControllerIntegrationDTO
