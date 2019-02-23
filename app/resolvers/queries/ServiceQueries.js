const AvailableServicesDTO = require("../../models/dto/AvailableServicesDTO")

function ServiceQueries({serviceService}) {

    const getAvailableServices = async (root, args, context) => {
        const {user} = context

        const controllerServices = await serviceService.getControllerServices(user)

        return new AvailableServicesDTO({controller: controllerServices})

    }

    return {
        getAvailableServices
    }

}

module.exports = ServiceQueries

