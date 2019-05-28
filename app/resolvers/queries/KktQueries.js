const KktDTO = require("../../models/dto/KktDTO")

function KktQueries({kktService}) {

    const getAllKkts = async (root, args, context) => {

        const {user} = context

        const kkts = await kktService.getAllKkts(user)

        if (!kkts) {
            return null
        }

        return kkts.map(kkt => (new KktDTO(kkt)))

    }

    const getUserKkts = async (root, args, context) => {

        const {user} = context

        const kkts = await kktService.getUserKkts(user)

        if (!kkts) {
            return null
        }

        return kkts.map(kkt => (new KktDTO(kkt)))

    }

    const getKktById = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const kkt = await kktService.getKktById(id, user)

        if (!kkt) {
            return null
        }

        return new KktDTO(kkt)
    }

    return {
        getAllKkts,
        getUserKkts,
        getKktById
    }

}

module.exports = KktQueries

