const MachineGroupDTO = require("../../models/dto/MachineGroupDTO")
const MachineTypeDTO = require("../../models/dto/MachineTypeDTO")
const MachineLogDTO = require("../../models/dto/MachineLogDTO")
const EquipmentDTO = require("../../models/dto/EquipmentDTO")

function MachineResolver({machineService}) {

    const group = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const machineGroup = await machine.getGroup()

        return new MachineGroupDTO(machineGroup)
    }

    const equipment = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const equipment = await machine.getEquipment()

        return new EquipmentDTO(equipment)
    }

    const type = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineById(obj.id, user)

        const type = await machine.getType()

        return new MachineTypeDTO(type)
    }

    const logs = async () => {
        //const {user} = context

        //const machine = await machineService.getMachineById(obj.id, user)

        const logs = []

        return logs.map(log => (new MachineLogDTO(log)))
    }

    return {
        group,
        equipment,
        type,
        logs
    }

}

module.exports = MachineResolver

