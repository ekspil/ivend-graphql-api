
const PartnerSettingsDTO = require("../../models/dto/PartnerSettingsDTO")

function PartnerMutations({partnerService}) {



    const changePartnerFee = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        const result = await partnerService.changeFee(input, user)
        return new PartnerSettingsDTO(result)

    }

    return {
        changePartnerFee,
    }

}

module.exports = PartnerMutations

