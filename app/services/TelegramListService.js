const NotAuthorized = require("../errors/NotAuthorized")
const NewsNotFound = require("../errors/NewsNotFound")
const TelegramList = require("../models/TelegramList")
const Permission = require("../enum/Permission")

class TelegramListService {

    constructor({TelegramListModel}) {
        this.TelegramList = TelegramListModel
        this.createTelegramList = this.createTelegramList.bind(this)
        this.changeTelegramList = this.changeTelegramList.bind(this)
        this.getTelegramList = this.getTelegramList.bind(this)
        this.getAllTelegramList = this.getAllTelegramList.bind(this)
    }

    async createTelegramList(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        const {date, text, link, header, active} = input

        const news = new TelegramList()
        news.date = date
        news.text = text
        news.link = link
        news.header = header
        news.active = active

        return await this.News.create(news)
    }

    async changeTelegramList(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        const {id, date, text, link, header, active} = input
        const news =  await this.News.findOne({
            where: {
                id
            }
        })
        if (!news) {
            throw new NewsNotFound()
        }

        news.date = date
        news.text = text
        news.link = link
        news.header = header
        news.active = active

        return await news.save()
    }


    async getTelegramList(user) {
        if (!user || !user.checkPermission(Permission.GET_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.News.findAll({
            where: {
                active: 1
            }
        })
    }
    async getAllTelegramList(user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.News.findAll()
    }

}

module.exports = TelegramListService
