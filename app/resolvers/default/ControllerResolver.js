const ControllerErrorDTO = require("../../models/dto/ControllerErrorDTO")
const ItemSaleStatDTO = require("../../models/dto/ItemSaleStatDTO")
const SalesSummaryDTO = require("../../models/dto/SalesSummaryDTO")
const ServiceDTO = require("../../models/dto/ServiceDTO")
const MachineDTO = require("../../models/dto/MachineDTO")
const UserDTO = require("../../models/dto/UserDTO")
const ControllerStateDTO = require("../../models/dto/ControllerStateDTO")
const BankTerminalDTO = require("../../models/dto/BankTerminalDTO")
const FiscalRegistrarDTO = require("../../models/dto/FiscalRegistrarDTO")

function ControllerResolver({saleService, controllerService, serviceService, machineService}) {

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

    const machine = async (obj, args, context) => {
        const {user} = context

        const machine = await machineService.getMachineByControllerId(obj.id, user)

        return new MachineDTO(machine)
    }

    const lastState = async (obj, args, context) => {
        const {user} = context

        const controller = await controllerService.getControllerById(obj.id, user)

        const controllerState = await controller.getLastState()

        if (!controllerState) {
            return null
        }

        return new ControllerStateDTO(controllerState)
    }

    const bankTerminal = async (obj, args, context) => {
        const {user} = context

        const controller = await controllerService.getControllerById(obj.id, user)

        const bankTerminal = await controller.getBankTerminal()

        if (!bankTerminal) {
            return null
        }

        return new BankTerminalDTO(bankTerminal)
    }

    const fiscalRegistrar = async (obj, args, context) => {
        const {user} = context

        const controller = await controllerService.getControllerById(obj.id, user)

        const fiscalRegistrar = await controller.getFiscalRegistrar()

        if (!fiscalRegistrar) {
            return null
        }

        return new FiscalRegistrarDTO(fiscalRegistrar)
    }


    const user = async (obj, args, context) => {
        const {user} = context

        const controller = await controllerService.getControllerById(obj.id, user)

        const controllerUser = await controller.getUser()

        return new UserDTO(fiscalRegistrar)
    }

    return {
        user,
        bankTerminal,
        fiscalRegistrar,
        lastState,
        lastSaleTime,
        itemSaleStats,
        overallSalesSummary,
        errors,
        lastErrorTime,
        services,
        machine
    }

}

module.exports = ControllerResolver

