const ControllerStateDTO = require("./ControllerStateDTO")

class ControllerDTO {

    constructor({id, name, uid, revision, status, mode, readStatMode, bankTerminalMode, bankTerminalUid, fiscalizationMode, accessKey, lastState, firmwareId, registrationTime, connected, remotePrinterId, simCardNumber, imsi, cashless, sim}) {
        this.id = id
        this.name = name
        this.uid = uid
        this.revision = revision
        this.status = status
        this.mode = mode
        this.readStatMode = readStatMode
        this.bankTerminalMode = bankTerminalMode
        this.bankTerminalUid = bankTerminalUid
        this.fiscalizationMode = fiscalizationMode
        this.accessKey = accessKey
        this.lastState = lastState ? new ControllerStateDTO(lastState) : null
        this.firmwareId = firmwareId
        this.registrationTime = registrationTime
        this.connected = connected
        this.remotePrinterId = remotePrinterId
        this.simCardNumber = simCardNumber
        this.imsi = imsi
        this.sim = sim
        this.cashless = cashless
    }
}

module.exports = ControllerDTO
