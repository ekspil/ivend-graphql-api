class Controller {
    constructor(id, name, uid, revision, mode, status, accessKey, user, fiscalRegistrar, bankTerminal, itemMatrix, firmwareId, registrationTime) {
        this.id = id
        this.name = name
        this.uid = uid
        this.revision = revision
        this.mode = mode
        this.status = status
        this.accessKey = accessKey
        this.user = user
        this.fiscalRegistrar = fiscalRegistrar
        this.bankTerminal = bankTerminal
        this.itemMatrix = itemMatrix
        this.firmwareId = firmwareId
        this.registrationTime = registrationTime
    }
}

module.exports = Controller


