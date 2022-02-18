

class SimDTO {

    constructor({id, userId, controllerId, terminalId, number, phone, imsi, expense, traffic, balance, terminal, controllerUid, userName}) {
        this.id = id
        this.userId = userId
        this.controllerId = controllerId
        this.terminalId = terminalId
        this.number = number
        this.phone = phone
        this.imsi = imsi
        this.balance = balance
        this.traffic = traffic
        this.expense = expense
        this.terminal = terminal
        this.controllerUid = controllerUid
        this.userName = userName
    }
}

module.exports = SimDTO
