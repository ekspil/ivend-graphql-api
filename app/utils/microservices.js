const fetch = require("node-fetch")
const SmsNotSent = require("../errors/SmsNotSent")
const EmailNotSent = require("../errors/EmailNotSent")
const DepositRequestFailed = require("../errors/DepositRequestFailed")
const PrintJobRequestFailed = require("../errors/PrintJobRequestFailed")
const ServiceNotFound = require("../errors/ServiceNotFound")
const MicroserviceUnknownError = require("../errors/MicroserviceUnknownError")
const FiscalReceiptDTO = require("../models/FiscalReceiptDTO")

const sendRegistrationSms = async (phone, code) => {
    const body = JSON.stringify({phone, code})

    const response = await fetch(`${process.env.NOTIFICATION_URL}/api/v1/template/REGISTRATION_SMS`, {
        method: "POST",
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
            throw new MicroserviceUnknownError(response.status)
    }
}

const sendRegistrationEmail = async (email, token) => {
    const body = JSON.stringify({token, email})

    const response = await fetch(`${process.env.NOTIFICATION_URL}/api/v1/template/REGISTRATION_EMAIL`, {
        method: "POST",
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
            throw new MicroserviceUnknownError(response.status)
    }
}

const sendChangeEmailEmail = async (email, token) => {
    const body = JSON.stringify({token, email})

    const response = await fetch(`${process.env.NOTIFICATION_URL}/api/v1/template/CHANGE_EMAIL`, {
        method: "POST",
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
            throw new MicroserviceUnknownError(response.status)
    }
}

const sendChangePasswordEmail = async (email, token) => {
    const body = JSON.stringify({token, email})

    const response = await fetch(`${process.env.NOTIFICATION_URL}/api/v1/template/CHANGE_PASSWORD`, {
        method: "POST",
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
            throw new MicroserviceUnknownError(response.status)
    }
}

const getServiceDailyPrice = async (service, userId) => {
    const response = await fetch(`${process.env.BILLING_URL}/api/v1/service/${service}/price/daily/${userId}`, {
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
            throw new MicroserviceUnknownError(response.status)
    }
}

const changeUserBalance = async (userId, sum) => {
    const response = await fetch(`${process.env.BILLING_URL}/api/v1/service/balance/change/${userId}/${sum}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    switch (response.status) {
        case 200:
            const json = await response.json()
            const {balance} = json

            return balance
        case 404:
            throw new ServiceNotFound()
        default:
            throw new MicroserviceUnknownError(response.status)
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
    const response = await fetch(`${process.env.REMOTE_PRINTING_URL}/api/v1/fiscal/receipt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fiscalReceiptDto)
    })

    switch (response.status) {
        case 200: {
            const json = await response.json()
            return new FiscalReceiptDTO(json)
        }
        default:
            throw new MicroserviceUnknownError(response.status)
    }

}


/**
 * Get receipt by id
 *
 * @param id {number}
 * @returns {Promise<FiscalReceiptDTO>}
 */
const getReceiptById = async (id) => {
    const response = await fetch(`${process.env.FISCAL_URL}/api/v1/fiscal/receipt/${id}`, {
        method: "GET"
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
            throw new MicroserviceUnknownError(response.status)
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
        sendChangePasswordEmail
    },
    billing: {
        getServiceDailyPrice,
        createPaymentRequest,
        changeUserBalance
    },
    fiscal: {
        createReceipt,
        getReceiptById
    }
}
