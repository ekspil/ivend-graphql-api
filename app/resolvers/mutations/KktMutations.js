const KktDTO = require("../../models/dto/KktDTO")


function KktMutations({kktService}) {

    const createKkt = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const kkt = await kktService.createKkt(input, user)

        return new KktDTO(kkt)
    }

    const deleteKkt = async (root, args, context) => {
        const {id} = args
        const {user} = context

        await kktService.deleteKkt(id, user)

        return true
    }

    const userDeleteKkt = async (root, args, context) => {
        const {id} = args
        const {user} = context

        await kktService.userDeleteKkt(id, user)

        return true
    }

    const editKkt = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const kkt = await kktService.editKkt(input, user)

        return new KktDTO(kkt)
    }

    const kktPlusBill = async (root, args, context) => {
        const {fn} = args
        const {user} = context

        return await kktService.kktPlusBill(fn, user)
    }

    return {
        createKkt,
        editKkt,
        kktPlusBill,
        deleteKkt,
        userDeleteKkt
    }

}

module.exports = KktMutations

