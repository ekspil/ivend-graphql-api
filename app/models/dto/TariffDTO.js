
class TariffDTO {

    constructor({id, telemetry, fiscal, acquiring, startedAt, meta, partnerId, createdAt}) {
        this.id = id
        this.telemetry = telemetry
        this.acquiring = acquiring
        this.fiscal = fiscal
        this.meta = meta
        this.partnerId = partnerId
        this.startedAt = startedAt
        this.createdAt = createdAt
    }
}

module.exports = TariffDTO
