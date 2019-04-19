const fetch = require("node-fetch")
const SmsNotSent = require("../errors/SmsNotSent")
const DepositRequestFailed = require("../errors/DepositRequestFailed")
const Deposit = require("../models/Deposit")
const ServiceNotFound = require("../errors/ServiceNotFound")
const MicroserviceUnknownError = require("../errors/MicroserviceUnknownError")

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
            throw new MicroserviceUnknownError()
    }
}

const getServiceDailyPrice = async (service) => {
    const response = await fetch(`${process.env.BILLING_URL}/api/v1/service/${service}/price/daily`, {
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
            throw new MicroserviceUnknownError()
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
        to: user.phone
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


module.exports = {
    notification: {
        sendRegistrationSms
    },
    billing: {
        getServiceDailyPrice,
        createPaymentRequest
    }
}