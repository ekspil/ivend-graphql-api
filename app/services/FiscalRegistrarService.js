const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const FiscalRegistrar = require("../models/FiscalRegistrar")

class FiscalRegistrarService {

    constructor({FiscalRegistrarModel}) {
        this.FiscalRegistrar = FiscalRegistrarModel

        this.createFiscalRegistrar = this.createFiscalRegistrar.bind(this)
        this.findById = this.findById.bind(this)
    }

    async createFiscalRegistrar(createFiscalRegistrarInput, user) {
        if (!user || !user.checkPermission(Permission.CREATE_FISCAL_REGISTRAR)) {
            throw new NotAuthorized()
        }

        const createFiscalRegistrar = new FiscalRegistrar()
        createFiscalRegistrar.name = createFiscalRegistrarInput.name

        return await this.FiscalRegistrar.create(createFiscalRegistrar)
    }

    async findById(id, user) {
        if (!user || !user.checkPermission(Permission.FIND_FISCAL_REGISTRAR_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.FiscalRegistrar.findOne({
            where: {
                id
            }
        })
    }

}

module.exports = FiscalRegistrarService
