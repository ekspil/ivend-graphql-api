const ControllerQueries = require("./ControllerQueries")

function Queries({ controllerService }) {

    const controllerQueries = new ControllerQueries({ controllerService })


    return {
        ...controllerQueries,
    }
}

module.exports = Queries

