const SaleDTO = require("../../models/dto/SaleDTO")

function SaleQueries({saleService}) {

    const getSales = async (root, args, context) => {
        const {user} = context
        const {offset, limit, machineId, itemId} = args

        const sales = await saleService.getSales({offset, limit, machineId, itemId, user})

        return sales.map(sale => (new SaleDTO(sale)))
    }
    const getItemSales = async (root, args, context) => {
        const {user} = context
        const {period, machineGroupId} = args

        const sales = await saleService.getItemSales({period, machineGroupId}, user)

        return sales
    }
    const getMachineSales = async (root, args, context) => {
        const {user} = context
        const {period, machineGroupId} = args

        const sales = await saleService.getMachineSales({period, machineGroupId}, user)

        return sales
    }

    return {
        getSales,
        getItemSales,
        getMachineSales
    }

}

module.exports = SaleQueries

