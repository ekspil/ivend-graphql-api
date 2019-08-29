const SaleDTO = require("../../models/dto/SaleDTO")

function SaleQueries({saleService}) {

    const getSales = async (root, args, context) => {
        const {user} = context
        const {machineId, itemId} = args

        const sales = await saleService.getSales(machineId, itemId, user)

        return sales.map(sale => (new SaleDTO(sale)))
    }

    return {
        getSales
    }

}

module.exports = SaleQueries

