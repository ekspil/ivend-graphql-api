const InstrDTO = require("../../models/dto/InstrDTO")


function InstrMutations({instrService}) {

    const createInstr = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const instr = await instrService.createInstr(input, user)

        return new InstrDTO(instr)
    }

    const deleteInstr = async (root, args, context) => {
        const {id} = args
        const {user} = context

        await instrService.deleteInstr(id, user)

        return true
    }

    const changeInstr = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const instr = await instrService.changeInstr(input, user)

        return new InstrDTO(instr)
    }


    return {
        createInstr,
        changeInstr,
        deleteInstr
    }

}

module.exports = InstrMutations

