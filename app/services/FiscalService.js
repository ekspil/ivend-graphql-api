const axios = require("axios")
const logger = require("my-custom-logger")

module.exports = {

    getToken: async function (login, pass, server) {
        const serverUrl = server || process.env.FISCAL_DEFAULT_SERVER
        let axConf = {
            method: "get",
            baseURL: `https://${serverUrl}/kkm-trade/atolpossystem/v4/getToken`,
            params: {
                "login": login,
                "pass": pass
            }

        }
        return await axios(axConf)
            .then((response) => {
                return response.data.token
            })

    },
    sendCheck: async function (check, token, server, machineKkt) {
        const serverUrl = server || process.env.FISCAL_DEFAULT_SERVER

        let axConf = {
            method: "post",
            baseURL: `https://${serverUrl}/kkm-trade/atolpossystem/v4/${machineKkt}/sell/`,
            data: check,
            headers: {
                "token": token,
                "Content-Type": "application/json"
            }

        }
        return await axios(axConf)
            .then((response) => {
                return response.data.uuid
            })

    },
    getStatus: async function (token, id, server) {
        const serverUrl = server || process.env.FISCAL_DEFAULT_SERVER
        let axConf = {
            method: "get",
            baseURL: `https://${serverUrl}/kkm-trade/atolpossystem/v4/any/report/${id}`,
            params: {
                "token": token
            }

        }
        return await axios(axConf)
            .then((response) => {
                return response.data
            })


    },
    getTimeStamp: function () {
        let date = new Date()
        let timeStamp = ""
        let year = Number(date.getFullYear().toString().slice(-2))
        let mounth = Number((date.getMonth() + 1))
        let day = Number(date.getDate())
        let hour = Number(date.getHours())
        let min = Number(date.getMinutes())
        let sec = Number(date.getSeconds())
        if (day < 10) {
            day = "0" + day
        }
        if (mounth < 10) {
            mounth = "0" + mounth
        }
        if (hour < 10) {
            hour = "0" + hour
        }
        if (min < 10) {
            min = "0" + min
        }
        if (sec < 10) {
            sec = "0" + sec
        }

        timeStamp = day + "." + mounth + "." + year + " " + hour + ":" + min + ":" + sec //"24.04.19 23:48:00"
        return timeStamp

    },
    prepareData: function (inn, itemName, checkSum, extId, timeStamp, payType, eMail, sno, place) {
        logger.debug("prepareData", inn, itemName, checkSum, extId, timeStamp, payType, eMail)
        let checkData = {
            external_id: extId,
            receipt: {
                client: {
                    email: "kkt@kkt.ru"
                },
                company: {
                    email: eMail,
                    sno: sno,
                    inn: inn,
                    payment_address: place
                },
                items: [
                    {
                        name: itemName,
                        price: checkSum,
                        quantity: 1.0,
                        sum: checkSum,
                        measurement_unit: "шт",
                        payment_method: "full_payment",
                        payment_object: "commodity",
                        vat: {
                            type: "none",
                            sum: 0
                        }
                    }
                ],
                payments: [
                    {
                        type: payType,
                        sum: checkSum
                    }
                ],

                total: checkSum
            },
            service: {
                callback_url: ""
            },
            timestamp: timeStamp
        }

        // Обработка налогов, но пока неоткуда взять данные


        return JSON.stringify(checkData)


    },
    getFiscalString: function (payload, sno) {
        let t_arr = payload.receipt_datetime.split(" ")
        let t_date = t_arr[0].split(".")
        t_date = t_date.reverse()
        t_date = "" + t_date[0] + t_date[1] + t_date[2]
        let t_time = t_arr[1].split(":")
        t_time = "" + t_time[0] + t_time[1] + t_time[2]
        let t = t_date + "T" + t_time
        let s = payload.total.toFixed(2)
        let fn = payload.fn_number
        let i = payload.fiscal_document_number
        let fp = payload.fiscal_document_attribute
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
