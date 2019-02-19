const ControllerResolver = require("./ControllerResolver")

function DefaultResolvers({saleService}) {
    const controllerResolver = new ControllerResolver({saleService})

    return {
        Controller: controllerResolver
    }
}

module.exports = DefaultResolvers
