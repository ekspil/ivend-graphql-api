const ControllerStateDTO = require("./ControllerStateDTO")

class ControllerDTO {

    constructor({id, name, uid, revision, status, mode, readStatMode, bankTerminalMode, fiscalizationMode, accessKey, lastState, firmwareId, registrationTime}) {
        this.id = id
        this.name = name
        this.uid = uid
        this.revision = revision
        this.status = status
        this.mode = mode
        this.readStatMode = readStatMode
        this.bankTerminalMode = bankTerminalMode
        this.fiscalizationMode = fiscalizationMode
        this.accessKey = accessKey
        this.lastState = lastState ? new ControllerStateDTO(lastState) : null
        this.firmwareId = firmwareId
        this.registrationTime = registrationTime
    }
}

module.exports = ControllerDTO
