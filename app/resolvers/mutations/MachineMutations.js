const MachineDTO = require("../../models/dto/MachineDTO")
const MachineTypeDTO = require("../../models/dto/MachineTypeDTO")
const MachineGroupDTO = require("../../models/dto/MachineGroupDTO")

function MachineMutations({machineService}) {


    const createMachine = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const machine = await machineService.createMachine(input, user)

        return new MachineDTO(machine)
    }

    const createMachineType = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const machineType = await machineService.createMachineType(input, user)

        return new MachineTypeDTO(machineType)
    }

    const createMachineGroup = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const machineGroup = await machineService.createMachineGroup(input, user)

        return new MachineGroupDTO(machineGroup)
    }

    return {
        createMachine,
        createMachineType,
        createMachineGroup
    }

}

module.exports = MachineMutations
