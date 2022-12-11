
const PartnerSettingsDTO = require("../../models/dto/PartnerSettingsDTO")
const PartnerInfosDTO = require("../../models/dto/PartnerInfosDTO")
const PartnerFeeDTO = require("../../models/dto/PartnerFeeDTO")
const TariffDTO = require("../../models/dto/TariffDTO")

function PartnerQueries({partnerService}) {



    const getPartnerFee = async (parent, args, context)=>{
        const {userId} = args
        const {user} = context

        const result = await partnerService.getFee(userId, user)
        return new PartnerSettingsDTO(result)

    }

    const getPartnerPayments = async (parent, args, context)=>{
        const {user} = context
        const {period} = args

        const result = await partnerService.getPartnerPayments(period, user)
        return result.map(item => new PartnerFeeDTO(item))

    }

    const getPartnerInfo = async (parent, args, context)=>{
        const {partnerId} = args
        const {user} = context

        const result = await partnerService.getPartnerInfo(partnerId, user)
        return new PartnerInfosDTO(result)

    }

    const getTariffs = async (parent, args, context)=>{
        const {user} = context
        const {partnerId} = args

        const result = await partnerService.getTariffs(partnerId, user)
        return result.map(tariff => new TariffDTO(tariff))

    }

    const getTariff = async (parent, args, context)=>{
        const {user} = context
        const {partnerId} = args
        const result = await partnerService.getTariff(partnerId, user)
        if(!result) throw new Error("No tariff")
        return new TariffDTO(result)

    }

    return {
        getPartnerFee,
        getTariffs,
        getTariff,
        getPartnerInfo,
        getPartnerPayments
    }

}

module.exports = PartnerQueries

