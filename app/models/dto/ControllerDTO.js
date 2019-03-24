const EquipmentDTO = require("./EquipmentDTO")
const FiscalRegistrarDTO = require("./FiscalRegistrarDTO")
const BankTerminalDTO = require("./BankTerminalDTO")
const ControllerStateDTO = require("./ControllerStateDTO")
const ItemMatrixDTO = require("./ItemMatrixDTO")

class ControllerDTO {

    constructor({id, name, equipment, uid, revision, status, mode, fiscalRegistrar, bankTerminal, accessKey, lastState, itemMatrix}) {
        this.id = id
        this.name = name
        this.equipment = equipment ? new EquipmentDTO(equipment) : null
        this.uid = uid
        this.revision = revision
        this.status = status
        this.mode = mode
        this.fiscalRegistrar = fiscalRegistrar ? new FiscalRegistrarDTO(fiscalRegistrar) : null
        this.bankTerminal = bankTerminal ? new BankTerminalDTO(bankTerminal) : null
        this.accessKey = accessKey
        this.lastState = lastState ? new ControllerStateDTO(lastState) : null
        this.itemMatrix = itemMatrix ? new ItemMatrixDTO(itemMatrix) : null
    }
}

module.exports = ControllerDTO
