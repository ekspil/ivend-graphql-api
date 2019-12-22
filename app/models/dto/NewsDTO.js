

class NewsDTO {

    constructor({id, date, text, link, header, active}) {
        this.id = id
        this.date = date
        this.text = text
        this.link = link
        this.header = header
        this.active = active
    }
}

module.exports = NewsDTO
