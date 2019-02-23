class NotificationDTO {

    constructor({type, email, sms}) {
        this.type = type
        this.email = email
        this.sms = sms
    }
}

module.exports = NotificationDTO
