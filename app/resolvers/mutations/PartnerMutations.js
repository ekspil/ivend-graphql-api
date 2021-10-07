
const PartnerSettingsDTO = require("../../models/dto/PartnerSettingsDTO")
const TariffDTO = require("../../models/dto/TariffDTO")

function PartnerMutations({partnerService}) {



    const changePartnerFee = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        const result = await partnerService.changeFee(input, user)
        return new PartnerSettingsDTO(result)

    }

    const createTariff = async (parent, args, context)=>{
        const {input} = args
        const {user} = context

        const result = await partnerService.createTariff(input, user)
        return new TariffDTO(result)

    }

    return {
        changePartnerFee,
        createTariff
    }

}

module.exports = PartnerMutations

