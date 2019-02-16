const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const Service = require("../models/Service")

class ServiceService {

    constructor({ServiceModel, UserServicesModel}) {
        this.Service = ServiceModel
        this.UserServicesModel = UserServicesModel

        this.createService = this.createService.bind(this)
        this.findById = this.findById.bind(this)
        this.addServicesToUser = this.addServicesToUser.bind(this)
    }

    async createService(createServiceInput, user) {
        if (!user || !user.checkPermission(Permission.WRITE_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const {name, price} = createServiceInput

        const service = new Service()
        service.name = name
        service.price = price

        return await this.Service.create(service)
    }

    async findById(id, user) {
        if (!user || !user.checkPermission(Permission.READ_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        return await this.Service.findOne({
            where: {
                id
            }
        })
    }

    async addServicesToUser(services, user) {
        if (!user || !user.checkPermission(Permission.READ_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        for (const service of services) {
            // Check that such service exist in the user
            const userService = await this.UserServicesModel.findOne({where: {service_id: service.id}})

            if (userService) {
                // If exist, update count
                await userService.increment("count")
            } else {
                // If not, add
                await user.addService(service, {
                    through: {
                        count: 1
                    }
                })
            }
        }
    }
}

module.exports = ServiceService
