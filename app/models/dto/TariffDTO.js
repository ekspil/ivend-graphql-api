
class TariffDTO {

    constructor({id, telemetry, fiscal, acquiring, startedAt, meta, smart, partnerId, createdAt}) {
        this.id = id
        this.telemetry = telemetry
        this.acquiring = acquiring
        this.fiscal = fiscal
        this.meta = meta
        this.smart = smart
        this.partnerId = partnerId
        this.startedAt = startedAt
        this.createdAt = createdAt
    }
}

module.exports = TariffDTO
