const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const Service = require("../models/Service")

class ServiceService {

    constructor({ServiceModel}) {
        this.Service = ServiceModel

        this.createService = this.createService.bind(this)
        this.findById = this.findById.bind(this)
        this.getControllerServices = this.getControllerServices.bind(this)
        this.getServicesForController = this.getServicesForController.bind(this)
    }

    async createService(createServiceInput, user) {
        if (!user || !user.checkPermission(Permission.CREATE_SERVICE)) {
            throw new NotAuthorized()
        }

        const {name, price, billingType, type} = createServiceInput

        const service = new Service()
        service.name = name
        service.price = price
        service.billingType = billingType
        service.type = type

        return await this.Service.create(service)
    }

    async findById(id, user) {
        if (!user || !user.checkPermission(Permission.FIND_SERVICE_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.Service.findOne({
            where: {
                id
            }
        })
    }

    async getServicesForController(id, user) {
        if (!user || !user.checkPermission(Permission.GET_SERVICES_FOR_CONTROLLER)) {
            throw new NotAuthorized()
        }

        //todo check access

        return await this.Service.findAll({
            where: {
                id,
                type: "CONTROLLER"
            }
        })
    }

    async getControllerServices(user) {
        if (!user || !user.checkPermission(Permission.GET_CONTROLLER_SERVICES)) {
            throw new NotAuthorized()
        }

        return await this.Service.findAll({
            where: {
                type: "CONTROLLER"
            }
        })
    }

}

module.exports = ServiceService
