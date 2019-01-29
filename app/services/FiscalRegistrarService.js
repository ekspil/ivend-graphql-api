const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const FiscalRegistrar = require("../models/FiscalRegistrar")

class FiscalRegistrarService {

    constructor({ fiscalRegistrarRepository }) {
        this.fiscalRegistrarRepository = fiscalRegistrarRepository

        this.createFiscalRegistrar = this.createFiscalRegistrar.bind(this)
        this.findById = this.findById.bind(this)
    }

    async createFiscalRegistrar(createFiscalRegistrarInput, user) {
        if (!user || !user.checkPermission(Permission.WRITE_FISCAL_REGISTRAR)) {
            throw new NotAuthorized()
        }

        const createFiscalRegistrar = new FiscalRegistrar()
        createFiscalRegistrar.name = createFiscalRegistrarInput.name

        return await this.fiscalRegistrarRepository.save(createFiscalRegistrar)
    }

    async findById(id, user) {
        if (!user || !user.checkPermission(Permission.READ_FISCAL_REGISTRAR)) {
            throw new NotAuthorized()
        }

        return await this.fiscalRegistrarRepository.findOne({id})
    }

}

module.exports = FiscalRegistrarService
