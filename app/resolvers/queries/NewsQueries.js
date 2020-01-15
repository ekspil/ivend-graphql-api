const NewsDTO = require("../../models/dto/NewsDTO")

function NewsQueries({newsService}) {

    const getAllNews = async (root, args, context) => {

        const {user} = context

        const news = await newsService.getAllNews(user)

        if (!news) {
            return null
        }

        return news.map(news => (new NewsDTO(news)))

    }

    const getNews = async (root, args, context) => {

        const {user} = context

        const news = await newsService.getNews(user)

        if (!news) {
            return null
        }

        return news.map(news => (new NewsDTO(news)))

    }


    const getNewsById = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const news = await newsService.getNewsById(id, user)

        if (!news) {
            return null
        }

        return new NewsDTO(news)
    }

    return {
        getNews,
        getAllNews,
        getNewsById
    }

}

module.exports = NewsQueries

