const ControllerResolver = require("./ControllerResolver")

function DefaultResolvers({saleService, controllerService}) {
    const controllerResolver = new ControllerResolver({saleService, controllerService})

    return {
        Controller: controllerResolver
    }
}

module.exports = DefaultResolvers
