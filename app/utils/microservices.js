const fetch = require("node-fetch")
const SmsNotSent = require("../errors/SmsNotSent")
const EmailNotSent = require("../errors/EmailNotSent")
const DepositRequestFailed = require("../errors/DepositRequestFailed")
const PrintJobRequestFailed = require("../errors/PrintJobRequestFailed")
const ServiceNotFound = require("../errors/ServiceNotFound")
const MicroserviceUnknownError = require("../errors/MicroserviceUnknownError")
const FiscalReceiptDTO = require("../models/FiscalReceiptDTO")


const sendRegistrationSms = async (phone, code) => {
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/REGISTRATION_SMS`
    const method = "POST"
    const body = JSON.stringify({phone, code})

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {sent} = json

            if (!sent) {
                throw new SmsNotSent()
            }

            return
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const sendRegistrationEmail = async (email, token) => {
    const body = JSON.stringify({token, email})
    const method = "POST"
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/REGISTRATION_EMAIL`

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {sent} = json

            if (!sent) {
                throw new EmailNotSent()
            }

            return
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const sendChangeEmailEmail = async (email, token) => {
    const body = JSON.stringify({token, email})
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/CHANGE_EMAIL`
    const method = "POST"

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.jon()
            const {sent} = json

            if (!sent) {
                throw new EmailNotSent()
            }

            return
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const sendChangePasswordEmail = async (email, token) => {
    const body = JSON.stringify({token, email})
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/CHANGE_PASSWORD`
    const method = "POST"

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {sent} = json

            if (!sent) {
                throw new EmailNotSent()
            }

            return
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const sendTextEmail = async (email, text) => {
    const body = JSON.stringify({text, email})
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/TEXT_EMAIL`
    const method = "POST"

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {sent} = json

            if (!sent) {
                throw new EmailNotSent()
            }

            return
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const sendTextSMS = async (phone, text) => {
    const body = JSON.stringify({text, phone})
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/SMS_NEWS`
    const method = "POST"

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {sent} = json

            if (!sent) {
                throw new EmailNotSent()
            }

            return
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const sendEmail = async (input, user) => {

    let legalInfo = await user.getLegalInfo()
    if(!legalInfo) legalInfo = {companyName: "Компания не указана"}
    const body = JSON.stringify({input, user, email: process.env.TP_EMAIL, legalInfo})
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/SEND_EMAIL`
    const method = "POST"

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })
    switch (res.status) {
        case 200:
            const json = await res.json()
            const {sent} = json

            if (!sent) {
                return false
            }

            return true
        default:
            throw new MicroserviceUnknownError(method, url, res.status)
    }
}

const sendEmailOrder = async (input, user, sameUser) => {
    let email = "sale@ivend.pro"

    let legalInfo = await user.getLegalInfo()
    if(!legalInfo) return false

    if(sameUser){
        if(legalInfo.contactEmail.includes("@")){
            email = email + ", " + legalInfo.contactEmail
        }
        else if(user.email.includes("@")) {
            email = email + ", " + legalInfo.contactEmail
        }
        else{
            return false
        }

    }
    const body = JSON.stringify({input, user, email, legalInfo})
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/SEND_ORDER`
    const method = "POST"

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (res.status) {
        case 200:
            const json = await res.json()
            const {sent} = json

            if (!sent) {
                return false
            }

            return true
        default:
            throw new MicroserviceUnknownError(method, url, res.status)
    }
}

const sendRememberPasswordEmail = async (email, token) => {
    const body = JSON.stringify({token, email})
    const url = `${process.env.NOTIFICATION_URL}/api/v1/template/REMEMBER_PASSWORD`
    const method = "POST"

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {sent} = json

            if (!sent) {
                throw new EmailNotSent()
            }

            return true
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}


const getServiceDailyPrice = async (service, userId) => {
    const url = `${process.env.BILLING_URL}/api/v1/service/${service}/price/daily/${userId}`
    const method = "GET"

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {price} = json

            return price
        case 404:
            throw new ServiceNotFound()
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}



const getTariff = async (service, userId) => {
    const url = `${process.env.BILLING_URL}/api/v1/service/${service}/price/tariff/${userId}`
    const method = "GET"

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    switch (response.status) {
        case 200:
            return await response.json()
        case 404:
            throw new ServiceNotFound()
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const getAqsiDevice = async (deviceId, token) => {
    const url = `${process.env.AQSI_URL || "https://api-cube.aqsi.ru"}/tlm/v1/device/${deviceId}`
    const method = "GET"



    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })

    switch (response.status) {
        case 200:
            return await response.json()
        case 404:
            throw new ServiceNotFound()
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

const changeUserBalance = async (userId, sum) => {
    const url = `${process.env.BILLING_URL}/api/v1/service/balance/change/${userId}/${sum}`
    const method = "GET"

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {paymentRequestId} = json

            return paymentRequestId
        case 404:
            throw new ServiceNotFound()
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }
}

/**
 * Create payment request
 *
 * @param amount {Number}
 * @param user {User}
 * @returns {Promise<String>} paymentRequestId
 */
const createPaymentRequest = async (amount, user) => {
    const body = JSON.stringify({
        amount,
        phone: user.phone,
        userId: user.id,
        email: user.email
    })

    const response = await fetch(`${process.env.BILLING_URL}/api/v1/billing/createPayment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {paymentRequestId} = json

            return paymentRequestId
        default:
            throw new DepositRequestFailed()
    }

}

const sendPrintJob = async (remotePrinterId, replacements) => {
    const body = JSON.stringify({
        replacements
    })

    const response = await fetch(`${process.env.REMOTE_PRINTING_URL}/api/v1/printer/${remotePrinterId}/queue`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200:
            return
        default:
            throw new PrintJobRequestFailed()
    }

}


/**
 * Send sale to the fiscal service
 *
 * @param fiscalReceiptDto {FiscalReceiptDTO}
 * @returns {Promise<FiscalReceiptDTO>}
 */
const createReceipt = async (fiscalReceiptDto) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/receipt`
    const method = "POST"
    const body = JSON.stringify(fiscalReceiptDto)

    const response = await fetch(`${process.env.FISCAL_URL}/api/v1/fiscal/receipt`, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return new FiscalReceiptDTO(json)
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}


const createReceiptRekassa = async (fiscalReceiptDto) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/receiptRekassa`
    const method = "POST"
    const body = JSON.stringify(fiscalReceiptDto)

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return new FiscalReceiptDTO(json)
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}


const createReceiptTelemedia = async (fiscalReceiptDto) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/receiptTelemedia`
    const method = "POST"
    const body = JSON.stringify(fiscalReceiptDto)

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return new FiscalReceiptDTO(json)
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}


/**
 * Get receipt by id
 *
 * @param id {number}
 * @returns {Promise<FiscalReceiptDTO>}
 */
const getReceiptById = async (id) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/receipt/${id}`
    const method = "GET"

    const response = await fetch(`${process.env.FISCAL_URL}/api/v1/fiscal/receipt/${id}`, {
        method
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return new FiscalReceiptDTO(json)
        }
        case 404: {
            return null
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}



/**
 * Get receipt by id
 *
 * @param id {number}
 * @returns {Promise<FiscalReceiptDTO>}
 */
const getReceiptStatuses = async (ids) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/statuses`
    const method = "POST"
    const body = JSON.stringify(ids)

    const response = await fetch(`${process.env.FISCAL_URL}/api/v1/fiscal/statuses`, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return json
        }
        default:

            throw new MicroserviceUnknownError(method, url + " body: " + JSON.stringify(body), response.status)
    }

}


/**
 * Get receipt by id
 *
 * @param id {number}
 * @returns {Promise<FiscalReceiptDTO>}
 */
const getKktStatus = async (kktRegNumber) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/status/kktRegNumber/${kktRegNumber}`
    const method = "GET"

    const response = await fetch(url, {
        method
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return json.status
        }
        case 404: {
            return null
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}
const getKktInfo = async (kktRegNumber) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/info/kktRegNumber/${kktRegNumber}`
    const method = "GET"

    const response = await fetch(url, {
        method
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return json
        }
        case 404: {
            return null
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}
const reSendCheck = async (receiptId) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/receipt/resend/${receiptId}`
    const method = "GET"

    const response = await fetch(url, {
        method
    })

    switch (response.status) {
        case 200: {
            return true
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}
const getControllerKktStatus = async (controllerUid) => {
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/status/controllerUid/${controllerUid}`
    const method = "GET"

    const response = await fetch(url, {
        method
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return json.status
        }
        case 404: {
            return null
        }
        default:
            throw new MicroserviceUnknownError(method, url, response.status)
    }

}

/**
 * Get receipt by id
 *
 * @param id {number}
 * @returns {String}
 */
const goodLineAuth = async () => {
    const login = process.env.GOODLINE_LOGIN || "api-info@ivend.pro"
    const pass = process.env.GOODLINE_PASS || "95aYfVAWRTG4Uh4b"
    const url = `https://api.m2m.express/api/v2/login?email=${login}&password=${pass}`
    const method = "POST"

    const response = await fetch(url, {
        method,
        headers: {
            "Accept": "application/json"
        }
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return json.access_token
        }
        default:
            throw new MicroserviceUnknownError(method, "", response.status)
    }

}

/**
 * Get receipt by id
 *
 * @param id {number}
 * @returns {Boolean}
 */
const reset = async (sim) => {

    const token = await goodLineAuth()

    const url = `https://api.m2m.express/api/v2/simcards/${sim}/cancelLocation`
    const method = "POST"

    const response = await fetch(url, {
        method,
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        },
    })

    switch (response.status) {
        case 200: {
            return true
        }
        default:
            return false
    }

}
/**
 * Get receipt by id
 *
 * @param id {integer}
 * @param commands {array}
 * @returns {[Boolean]}
 */
const sendCommands = async (id, commands) => {

    const url = `https://api.vendista.ru:99/terminals/${id}/commands?token=${process.env.VEDNISTA_API_TOKEN}`
    const method = "POST"
    const result = []

   

    for( let command of commands){
        try{
            const body = {
                "command_id": command.id,
                "parameter1": command.parameter1 || 0,
                "parameter2": command.parameter2 || 0,
                "parameter3": command.parameter3 || 0,
                "parameter4": command.parameter4 || 0,
                "parameter5": command.parameter5 || 0,
                "str_parameter1": command.parameter6 || 0,
                "str_parameter2": command.parameter7 || 0,
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "accept": "text/plain",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            await new Promise(res => setTimeout(res, 1100))


            const json = await response.json()
            switch (response.status) {
                case 200: {
                    if(json.success === true){
                        result.push(true)
                    }
                    else {
                        result.push(false)
                    }

                    break
                }
                default:
                    result.push(false)
            }




        }
        catch (e) {
            return null
        }

    }
    return result


}


module.exports = {
    remotePrinting: {
        sendPrintJob
    },
    notification: {
        sendRegistrationSms,
        sendRegistrationEmail,
        sendChangeEmailEmail,
        sendChangePasswordEmail,
        sendRememberPasswordEmail,
        sendEmail,
        sendEmailOrder,
        sendTextEmail,
        sendTextSMS
    },
    billing: {
        getServiceDailyPrice,
        getTariff,
        createPaymentRequest,
        changeUserBalance
    },
    fiscal: {
        createReceipt,
        getReceiptById,
        createReceiptRekassa,
        createReceiptTelemedia,
        getKktStatus,
        getKktInfo,
        getControllerKktStatus,
        getReceiptStatuses,
        reSendCheck
    },
    sim: {
        reset
    },
    vendista: {
        sendCommands
    },
    aqsi: {
        getAqsiDevice
    }
}
