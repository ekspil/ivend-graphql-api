class ControllerState {
    constructor(id, coinAcceptor, billAcceptor, coinAmount, billAmount, dex1Bus, dex2Bus, exeBus, mdbBus) {
        this.id = id
        this.coinAcceptor = coinAcceptor
        this.billAcceptor = billAcceptor
        this.coinAmount = coinAmount
        this.billAmount = billAmount
        this.dex1Bus = dex1Bus
        this.dex2Bus = dex2Bus
        this.exeBus = exeBus
        this.mdbBus = mdbBus
    }

}

module.exports = ControllerState
