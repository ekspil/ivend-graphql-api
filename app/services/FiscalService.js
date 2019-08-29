module.exports = {

    /**
     *20190704T013736
     * @param receipt {FiscalReceiptDTO}
     * @returns {string}
     */
    getFiscalString: function (receipt) {
        const {sno} = receipt
        const {fiscalData} = receipt
        const {totalAmount, fnNumber, fiscalDocumentNumber, fiscalDocumentAttribute} = fiscalData

        const receiptDatetime = new Date(fiscalData.receiptDatetime)

        const t = `${receiptDatetime.getFullYear()}${receiptDatetime.getMonth() + 1}${receiptDatetime.getDate()}T${receiptDatetime.getHours()}${receiptDatetime.getMinutes()}${receiptDatetime.getSeconds()}`
        const s = totalAmount
        const fn = fnNumber
        const i = fiscalDocumentNumber
        const fp = fiscalDocumentAttribute

        let n = 1

        switch (sno) {
            case "usn_income":
                n = 1
                break
            case "usn_income_outcome":
                n = 2
                break
            case "envd":
                n = 3
                break
            case "esn":
                n = 4
                break
            case "patent":
                n = 5
                break
            case "osn":
                n = 0
                break
            default:
                n = 1
                break
        }


        return "t=" + t + "&s=" + s + "&fn=" + fn + "&i=" + i + "&fp=" + fp + "&n=" + n
    }

}
