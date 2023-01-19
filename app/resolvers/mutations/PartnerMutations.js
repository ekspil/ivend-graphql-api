
const PartnerSettingsDTO = require("../../models/dto/PartnerSettingsDTO")
const PartnerInfosDTO = require("../../models/dto/PartnerInfosDTO")
const TariffDTO = require("../../models/dto/TariffDTO")

function PartnerMutations({partnerService}) {



    const changePartnerFee = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        const result = await partnerService.changeFee(input, user)
        return new PartnerSettingsDTO(result)

    }
    const createFeeTransaction = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        const result = await partnerService.createFeeTransaction(input, user)
        return new PartnerSettingsDTO(result)

    }
    const successFeeTransaction = async (parent, args, context)=>{
        const {id} = args
        const {user} = context

        const result = await partnerService.successFeeTransaction(id, user)
        return result

    }

    const createTariff = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        const result = await partnerService.createTariff(input, user)
        return new TariffDTO(result)

    }

    const updatePartnerInfo = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        const result = await partnerService.updatePartnerInfo(input, user)
        return new PartnerInfosDTO(result)

    }

    return {
        changePartnerFee,
        createTariff,
        updatePartnerInfo,
        createFeeTransaction,
        successFeeTransaction
    }

}

module.exports = PartnerMutations

