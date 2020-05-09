const InstrDTO = require("../../models/dto/InstrDTO")

function InstrQueries({instrService}) {

    const getAllInstr = async (root, args, context) => {

        const {user} = context

        const instr = await instrService.getAllInstr(user)

        if (!instr) {
            return null
        }

        return instr.map(instr => (new InstrDTO(instr)))

    }

    const getInstr = async (root, args, context) => {

        const {user} = context

        const instr = await instrService.getInstr(user)

        if (!instr) {
            return null
        }

        return instr.map(instr => (new InstrDTO(instr)))

    }


    const getInstrById = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const instr = await instrService.getInstrById(id, user)

        if (!instr) {
            return null
        }

        return new InstrDTO(instr)
    }

    return {
        getInstr,
        getAllInstr,
        getInstrById
    }

}

module.exports = InstrQueries

