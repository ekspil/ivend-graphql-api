const InfoDTO = require("../../models/dto/InfoDTO")


function InfoMutations({infoService}) {

    const createInfo = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const info = await infoService.createInfo(input, user)

        return new InfoDTO(info)
    }

    const deleteInfo = async (root, args, context) => {
        const {id} = args
        const {user} = context

        await infoService.deleteInfo(id, user)

        return true
    }

    const changeInfo = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const info = await infoService.changeInfo(input, user)

        return new InfoDTO(info)
    }
    const createPartnerInfo = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const info = await infoService.createPartnerInfo(input, user)

        return new InfoDTO(info)
    }

    const deletePartnerInfo = async (root, args, context) => {
        const {id} = args
        const {user} = context

        await infoService.deletePartnerInfo(id, user)

        return true
    }

    const changePartnerInfo = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const info = await infoService.changePartnerInfo(input, user)

        return new InfoDTO(info)
    }


    return {
        createInfo,
        changeInfo,
        deleteInfo,
        createPartnerInfo,
        changePartnerInfo,
        deletePartnerInfo,
    }

}

module.exports = InfoMutations

