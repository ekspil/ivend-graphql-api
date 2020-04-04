class ServiceDTO {

    constructor({id, name, price, billingType, fixCount}) {
        this.id = id
        this.name = name
        this.price = price
        this.fixCount = fixCount
        this.billingType = billingType
    }
}

module.exports = ServiceDTO
