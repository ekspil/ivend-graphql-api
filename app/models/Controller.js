class Controller {
    constructor(id, name, uid, equipment, revision, mode, status, accessKey, user, fiscalRegistrar, bankTerminal) {
        this.id = id
        this.name = name
        this.uid = uid
        this.revision = revision
        this.mode = mode
        this.status = status
        this.accessKey = accessKey
        this.user = user
        this.equipment = equipment
        this.fiscalRegistrar = fiscalRegistrar
        this.bankTerminal = bankTerminal
    }
}

module.exports = Controller
