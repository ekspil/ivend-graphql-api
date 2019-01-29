const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const FiscalRegistrar = require("../models/FiscalRegistrar")

class FiscalRegistrarService {

    constructor({ fiscalRegistrarRepository }) {
        this.fiscalRegistrarRepository = fiscalRegistrarRepository

        this.createFiscalRegistrar = this.createFiscalRegistrar.bind(this)
    }

    async createFiscalRegistrar(createFiscalRegistrarInput, user) {
        if (!user || !user.checkPermission(Permission.WRITE_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const createFiscalRegistrar = new FiscalRegistrar()
        createFiscalRegistrar.name = createFiscalRegistrarInput.name

        return await this.fiscalRegistrarRepository.save(createFiscalRegistrar)
    }

}

module.exports = FiscalRegistrarService
