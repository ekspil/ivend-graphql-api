class ControllerState {
    constructor(id, coinAcceptorStatus, billAcceptorStatus, coinAmount, billAmount, dex1Status, dex2Status, exeStatus, mdbStatus, signalStrength, registrationTime, controller, attentionRequired) {
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
        this.controller = controller
        this.attentionRequired = attentionRequired
    }

}

module.exports = ControllerState
