const NotAuthorized = require("../errors/NotAuthorized")
const NewsNotFound = require("../errors/NewsNotFound")
const News = require("../models/News")
const Permission = require("../enum/Permission")

class NewsService {

    constructor({NewsModel}) {
        this.News = NewsModel
        this.createNews = this.createNews.bind(this)
        this.changeNews = this.changeNews.bind(this)
        this.deleteNews = this.deleteNews.bind(this)
        this.getNewsById = this.getNewsById.bind(this)
        this.getNews = this.getNews.bind(this)
        this.getAllNews = this.getAllNews.bind(this)
    }

    async createNews(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        const {date, text, link, header, active} = input

        const news = new News()
        news.date = date
        news.text = text
        news.link = link
        news.header = header
        news.active = active

        return await this.News.create(news)
    }

    async changeNews(input, user) {
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


    async deleteNews(id, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        const news =  await this.News.findOne({
            where: {
                id
            }
        })
        if (!news) {
            throw new NewsNotFound()
        }



        return await news.destroy()
    }

    async getNewsById(id, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        return await this.News.findOne({
            where: {
                id
            }
        })

    }


    async getNews(user) {
        if (!user || !user.checkPermission(Permission.GET_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.News.findAll({
            where: {
                active: 1
            }
        })
    }
    async getAllNews(user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.News.findAll()
    }

}

module.exports = NewsService
