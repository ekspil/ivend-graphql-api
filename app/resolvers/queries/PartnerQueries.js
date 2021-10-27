
const PartnerSettingsDTO = require("../../models/dto/PartnerSettingsDTO")
const PartnerInfosDTO = require("../../models/dto/PartnerInfosDTO")
const TariffDTO = require("../../models/dto/TariffDTO")

function PartnerQueries({partnerService}) {



    const getPartnerFee = async (parent, args, context)=>{
        const {userId} = args
        const {user} = context

        const result = await partnerService.getFee(userId, user)
        return new PartnerSettingsDTO(result)

    }

    const getPartnerInfo = async (parent, args, context)=>{
        const {partnerId} = args
        const {user} = context

        const result = await partnerService.getPartnerInfo(partnerId, user)
        return new PartnerInfosDTO(result)

    }

    const getTariffs = async (parent, args, context)=>{
        const {user} = context

        const result = await partnerService.getTariffs(user)
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
        getPartnerInfo
    }

}

module.exports = PartnerQueries

