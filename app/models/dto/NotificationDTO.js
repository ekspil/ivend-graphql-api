class NotificationDTO {

    constructor({type, email, sms, telegram, telegramChat}) {
        this.type = type
        this.email = email
        this.sms = sms
        this.telegram = telegram
        this.telegramChat = telegramChat
    }
}

module.exports = NotificationDTO
