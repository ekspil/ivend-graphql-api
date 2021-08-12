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
    if(sameUser){
        email = user.email
    }
    let legalInfo = await user.getLegalInfo()
    if(!legalInfo) legalInfo = {companyName: "Компания не указана"}
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
    const url = `${process.env.FISCAL_URL}/api/v1/fiscal/receipt`
    const method = "POST"
    const body = JSON.stringify(fiscalReceiptDto)

    const response = await fetch(`${process.env.FISCAL_URL}/api/v1/fiscal/receiptRekassa`, {
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
        createPaymentRequest,
        changeUserBalance
    },
    fiscal: {
        createReceipt,
        getReceiptById,
        createReceiptRekassa
    }
}
