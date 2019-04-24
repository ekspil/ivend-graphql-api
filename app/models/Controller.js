class Controller {
    constructor(id, name, uid, revision, mode, status, accessKey, user, readStatMode, bankTerminalMode, fiscalizationMode, firmwareId, registrationTime, connected) {
        this.id = id
        this.name = name
        this.uid = uid
        this.revision = revision
        this.mode = mode
        this.status = status
        this.accessKey = accessKey
        this.user = user
        this.readStatMode = readStatMode
        this.bankTerminalMode = bankTerminalMode
        this.fiscalizationMode = fiscalizationMode
        this.firmwareId = firmwareId
        this.registrationTime = registrationTime
        this.connected = connected
    }
}

module.exports = Controller


