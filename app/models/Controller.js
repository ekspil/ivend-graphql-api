class Controller {
    constructor(id, name, uid, revision, mode, status, accessKey, user, readStatMode, bankTerminalMode, bankTerminalUid, fiscalizationMode, firmwareId, registrationTime, connected, remotePrinterId, simCardNumber, imsi, cashless, sim) {
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
        this.bankTerminalUid = bankTerminalUid
        this.fiscalizationMode = fiscalizationMode
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

module.exports = Controller


