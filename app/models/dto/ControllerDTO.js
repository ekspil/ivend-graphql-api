const EquipmentDTO = require("./EquipmentDTO")
const FiscalRegistrarDTO = require("./FiscalRegistrarDTO")
const BankTerminalDTO = require("./BankTerminalDTO")

class ControllerDTO {

    constructor({id, name, equipment, uid, revision, status, mode, fiscalRegistrar, bankTerminal}) {
        this.id = id
        this.name = name
        this.equipment = new EquipmentDTO(equipment)
        this.uid = uid
        this.revision = revision
        this.status = status
        this.mode = mode
        this.fiscalRegistrar = fiscalRegistrar ? new FiscalRegistrarDTO(fiscalRegistrar): null
        this.bankTerminal = bankTerminal ? new BankTerminalDTO(bankTerminal) : null
    }
}

module.exports = ControllerDTO
