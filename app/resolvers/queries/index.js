const ControllerQueries = require("./ControllerQueries")
const ItemQueries = require("./ItemQueries")

function Queries({ controllerService, itemMatrixService }) {

    const controllerQueries = new ControllerQueries({ controllerService, itemMatrixService })
    const itemQueries = new ItemQueries({ itemMatrixService })

    return {
        ...controllerQueries,
        ...itemQueries
    }
}

module.exports = Queries

