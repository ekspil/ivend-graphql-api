const MachineDTO = require("../../models/dto/MachineDTO")
const MachineGroupDTO = require("../../models/dto/MachineGroupDTO")
const MachineTypeDTO = require("../../models/dto/MachineTypeDTO")

function MachineQueries({machineService}) {

    const getMachines = async (root, args, context) => {
        const {user} = context

        const machines = await machineService.getAllMachinesOfUser(user)

        return machines.map(machine => (new MachineDTO(machine)))
    }

    const getMachineById = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const machine = await machineService.getMachineById(id, user)

        if (!machine) {
            return null
        }

        return new MachineDTO(machine)
    }

    const getMachineGroups = async (root, args, context) => {
        const {user} = context

        const machineGroups = await machineService.getAllMachineGroupsOfUser(user)

        return machineGroups.map(machineGroup => (new MachineGroupDTO(machineGroup)))
    }

    const getMachineTypes = async (root, args, context) => {
        const {user} = context

        const machineTypes = await machineService.getAllMachineTypes(user)

        return machineTypes.map(machineType => (new MachineTypeDTO(machineType)))
    }

    return {
        getMachines,
        getMachineById,
        getMachineGroups,
        getMachineTypes
    }

}

module.exports = MachineQueries

