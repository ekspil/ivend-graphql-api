const FiscalRegistrarDTO = require("../../models/dto/FiscalRegistrarDTO")

function FiscalRegistrarMutations({fiscalRegistrarService}) {

    const createFiscalRegistrar = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const equipment = await fiscalRegistrarService.createFiscalRegistrar(input, user)

        return new FiscalRegistrarDTO(equipment)
    }

    return {
        createFiscalRegistrar
    }

}

module.exports = FiscalRegistrarMutations

