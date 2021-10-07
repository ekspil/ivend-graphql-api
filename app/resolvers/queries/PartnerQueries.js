
const PartnerSettingsDTO = require("../../models/dto/PartnerSettingsDTO")
const TariffDTO = require("../../models/dto/TariffDTO")

function PartnerQueries({partnerService}) {



    const getPartnerFee = async (parent, args, context)=>{
        const {userId} = args
        const {user} = context

        const result = await partnerService.getFee(userId, user)
        return new PartnerSettingsDTO(result)

    }

    const getTariffs = async (parent, args, context)=>{
        const {user} = context

        const result = await partnerService.getTariffs(user)
        return result.map(tariff => new TariffDTO(tariff))

    }

    return {
        getPartnerFee,
        getTariffs
    }

}

module.exports = PartnerQueries

