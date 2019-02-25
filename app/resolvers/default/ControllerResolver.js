const ControllerErrorDTO = require("../../models/dto/ControllerErrorDTO")
const ItemSaleStatDTO = require("../../models/dto/ItemSaleStatDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")
const ServiceDTO = require("../../models/dto/ServiceDTO")

function ControllerResolver({saleService, controllerService, serviceService}) {

    const lastSaleTime = async (obj, args, context) => {
        const {user} = context

        const lastSale = await saleService.getLastSale(obj.id, user)

        if (lastSale) {
            return lastSale.createdAt
        }

        return null
    }

    const itemSaleStats = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const itemSaleStats = await saleService.getItemSaleStats({controllerId: obj.id, period}, user)

        return itemSaleStats.map(itemSaleStat => (new ItemSaleStatDTO(itemSaleStat)))
    }

    const overallSalesSummary = async (obj, args, context) => {
        const {user} = context
        const {period} = args

        const salesSummary = await saleService.getSalesSummary({controllerId: obj.id, period}, user)

        return new SalesSummaryDTO(salesSummary)
    }

    const errors = async (obj, args, context) => {
        const {user} = context

        const controllerErrors = await controllerService.getControllerErrors(obj.id, user)

        return controllerErrors.map(controllerError => new ControllerErrorDTO(controllerError))
    }


    const lastErrorTime = async (obj, args, context) => {
        const {user} = context

        const controllerError = await controllerService.getLastControllerError(obj.id, user)

        if (!controllerError) {
            return null
        }

        return controllerError.errorTime
    }

    const services = async (obj, args, context) => {
        const {user} = context

        const services = await serviceService.getServicesForController(obj.id, user)

        return services.map(service => (new ServiceDTO(service)))
    }

    return {
        lastSaleTime,
        itemSaleStats,
        overallSalesSummary,
        errors,
        lastErrorTime,
        services
    }

}

module.exports = ControllerResolver

