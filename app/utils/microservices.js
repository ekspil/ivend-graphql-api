const fetch = require("node-fetch")
const SmsNotSent = require("../errors/SmsNotSent")
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


module.exports = {
    notification: {
        sendRegistrationSms
    }
}
