class FastSummaryDTO {

    constructor({countToday, countYesterday, amountToday, amountYesterday}) {
        this.countToday = countToday
        this.countYesterday = countYesterday
        this.amountToday = amountToday
        this.amountYesterday = amountYesterday
    }
}

module.exports = FastSummaryDTO
