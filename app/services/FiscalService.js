module.exports = {

    /**
     *20190704T013736
     * @param receipt {FiscalReceiptDTO}
     * @returns {string}
     */
    getFiscalString: function (receipt) {
        //const {sno} = receipt
        const {fiscalData} = receipt
        const {totalAmount, fnNumber, fiscalDocumentNumber, fiscalDocumentAttribute} = fiscalData

        const receiptDatetime = new Date(fiscalData.receiptDatetime)

        const year = receiptDatetime.getFullYear()
        const month = ("0" + (receiptDatetime.getMonth() + 1)).slice(-2)
        const day = ("0" + receiptDatetime.getDate()).slice(-2)
        const hours = ("0" + receiptDatetime.getHours()).slice(-2)
        const minutes = ("0" + receiptDatetime.getMinutes()).slice(-2)
        const seconds = ("0" + receiptDatetime.getSeconds()).slice(-2)

        const t = `${year}${month}${day}T${hours}${minutes}${seconds}`
        const s = totalAmount
        const fn = fnNumber
        const i = fiscalDocumentNumber
        const fp = fiscalDocumentAttribute

        let n = 1

        // switch (sno) {
        //     case "usn_income":
        //         n = 1
        //         break
        //     case "usn_income_outcome":
        //         n = 2
        //         break
        //     case "envd":
        //         n = 3
        //         break
        //     case "esn":
        //         n = 4
        //         break
        //     case "patent":
        //         n = 5
        //         break
        //     case "osn":
        //         n = 0
        //         break
        //     default:
        //         n = 1
        //         break
        // }


        return "t=" + t + "&s=" + s + "&fn=" + fn + "&i=" + i + "&fp=" + fp + "&n=" + n
    }

}
