class ControllerStateDTO {

    constructor({id, coinAcceptorStatus, billAcceptorStatus, coinAmount, billAmount, dex1Status, dex2Status, exeStatus, mdbStatus, signalStrength, registrationTime}) {
        this.id = id
        this.coinAcceptorStatus = coinAcceptorStatus
        this.billAcceptorStatus = billAcceptorStatus
        this.coinAmount = coinAmount
        this.billAmount = billAmount
        this.dex1Status = dex1Status
        this.dex2Status = dex2Status
        this.exeStatus = exeStatus
        this.mdbStatus = mdbStatus
        this.signalStrength = signalStrength
        this.registrationTime = registrationTime
    }
}

module.exports = ControllerStateDTO
