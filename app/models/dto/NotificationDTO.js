class NotificationDTO {

    constructor({type, email, sms, tlgrm, extraEmail, telegram, telegramChat}) {
        this.type = type
        this.email = email
        this.sms = sms
        this.tlgrm = tlgrm
        this.extraEmail = extraEmail
        this.telegram = telegram
        this.telegramChat = telegramChat
    }
}

module.exports = NotificationDTO
