const NewsDTO = require("../../models/dto/NewsDTO")


function NewsMutations({newsService}) {

    const createNews = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const news = await newsService.createNews(input, user)

        return new NewsDTO(news)
    }

    const deleteNews = async (root, args, context) => {
        const {id} = args
        const {user} = context

        await newsService.deleteNews(id, user)

        return true
    }

    const changeNews = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const news = await newsService.changeNews(input, user)

        return new NewsDTO(news)
    }


    const setNewsRead = async (root, args, context) => {
        const {user} = context

        const result = await newsService.setNewsRead(user)

        return result
    }


    return {
        createNews,
        changeNews,
        deleteNews,
        setNewsRead
    }

}

module.exports = NewsMutations

