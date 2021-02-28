const EquipmentDTO = require("./EquipmentDTO")
const MachineGroupDTO = require("./MachineGroupDTO")
const MachineTypeDTO = require("./MachineTypeDTO")
const KktDTO = require("./KktDTO")

class MachineDTO {

    constructor({id, number, name, place, group, machineGroup2Id, machineGroup3Id, equipment, type, kkt, kktStatus, terminalStatus, error, encashment}) {
        this.id = id
        this.number = number
        this.name = name
        this.terminalStatus = terminalStatus
        this.kktStatus = kktStatus
        this.error = error
        this.encashment = encashment
        this.place = place
        this.group = group ? new MachineGroupDTO(group) : null
        this.machineGroup2Id = machineGroup2Id
        this.machineGroup3Id = machineGroup3Id
        this.type = type ? new MachineTypeDTO(type) : null
        this.equipment = equipment ? new EquipmentDTO(equipment) : null
        this.kkt = kkt ? new KktDTO(kkt) : null
    }
}

module.exports = MachineDTO
