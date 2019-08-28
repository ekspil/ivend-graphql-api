module.exports = {

    /**
     *
     * @param receipt {FiscalReceiptDTO}
     * @returns {string}
     */
    getFiscalString: function (receipt) {
        const {sno} = receipt
        const {fiscalData} = receipt
        const {receiptDatetime, totalAmount, fnNumber, fiscalDocumentNumber, fiscalDocumentAttribute} = fiscalData

        let t_arr = receiptDatetime.split(" ")
        let t_date = t_arr[0].split(".")
        t_date = t_date.reverse()
        t_date = "" + t_date[0] + t_date[1] + t_date[2]
        let t_time = t_arr[1].split(":")
        t_time = "" + t_time[0] + t_time[1] + t_time[2]
        let t = t_date + "T" + t_time
        let s = totalAmount.total.toFixed(2)
        let fn = fnNumber
        let i = fiscalDocumentNumber
        let fp = fiscalDocumentAttribute
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
