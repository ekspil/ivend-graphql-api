
const PartnerSettingsDTO = require("../../models/dto/PartnerSettingsDTO")

function PartnerQueries({partnerService}) {



    const getPartnerFee = async (parent, args, context)=>{
        const {userId} = args
        const {user} = context

        const result = await partnerService.getFee(userId, user)
        return new PartnerSettingsDTO(result)

    }

    return {
        getPartnerFee,
    }

}

module.exports = PartnerQueries

