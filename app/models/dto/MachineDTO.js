const EquipmentDTO = require("./EquipmentDTO")
const MachineGroupDTO = require("./MachineGroupDTO")
const MachineTypeDTO = require("./MachineTypeDTO")
const KktDTO = require("./KktDTO")

class MachineDTO {

    constructor({id, number, name, place, group, equipment, type, kkt}) {
        this.id = id
        this.number = number
        this.name = name
        this.place = place
        this.group = group ? new MachineGroupDTO(group) : null
        this.type = type ? new MachineTypeDTO(type) : null
        this.equipment = equipment ? new EquipmentDTO(equipment) : null
        this.kkt = kkt ? new KktDTO(kkt) : null
    }
}

module.exports = MachineDTO
