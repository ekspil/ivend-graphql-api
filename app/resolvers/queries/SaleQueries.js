const SaleDTO = require("../../models/dto/SaleDTO")
const SaleNoLimitDTO = require("../../models/dto/SaleNoLimitDTO")

function SaleQueries({saleService}) {

    const getSales = async (root, args, context) => {
        const {user} = context
        const {offset, limit, machineId, itemId, period} = args

        const sales = await saleService.getSales({offset, limit, machineId, itemId, user, period})

        return sales.map(sale => (new SaleDTO(sale)))
    }

    const getSalesNoLimit = async (root, args, context) => {
        const {user} = context
        const {machineId, itemId, period} = args

        const sales = await saleService.getSalesNoLimit({ machineId, itemId, user, period})

        return sales.map(sale => (new SaleNoLimitDTO(sale)))
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
        getMachineSales,
        getSalesNoLimit
    }

}

module.exports = SaleQueries

