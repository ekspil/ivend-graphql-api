const InfoDTO = require("../../models/dto/InfoDTO")

function InfoQueries({infoService}) {

    const getAllInfo = async (root, args, context) => {

        const {user} = context

        const info = await infoService.getAllInfo(user)

        if (!info) {
            return null
        }

        return info.map(info => (new InfoDTO(info)))

    }

    const getInfo = async (root, args, context) => {

        const {user} = context

        const info = await infoService.getInfo(user)

        if (!info) {
            return null
        }

        return info.map(info => (new InfoDTO(info)))

    }


    const getInfoById = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const info = await infoService.getInfoById(id, user)

        if (!info) {
            return null
        }

        return new InfoDTO(info)
    }
    const getAllPartnerInfo = async (root, args, context) => {

        const {user} = context

        const info = await infoService.getAllPartnerInfo(user)

        if (!info) {
            return null
        }

        return info.map(info => (new InfoDTO(info)))

    }

    const getPartnerInfo = async (root, args, context) => {

        const {user} = context

        const info = await infoService.getPartnerInfo(user)

        if (!info) {
            return null
        }

        return info.map(info => (new InfoDTO(info)))

    }


    const getPartnerInfoById = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const info = await infoService.getPartnerInfoById(id, user)

        if (!info) {
            return null
        }

        return new InfoDTO(info)
    }

    return {
        getInfo,
        getAllInfo,
        getInfoById,
        getPartnerInfo,
        getAllPartnerInfo,
        getPartnerInfoById,
    }

}

module.exports = InfoQueries

