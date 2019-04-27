const KktDTO = require("../../models/dto/KktDTO")


function KktMutations({kktService}) {

    const createKkt = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const kkt = await kktService.createKkt(input, user)

        return new KktDTO(kkt)
    }



    const editKkt = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const kkt = await kktService.editKkt(input, user)

        return new KktDTO(kkt)
    }

    return {
        createKkt,
        editKkt
    }

}

module.exports = KktMutations

