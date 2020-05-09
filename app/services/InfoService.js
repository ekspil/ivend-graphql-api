const NotAuthorized = require("../errors/NotAuthorized")
const InfoNotFound = require("../errors/InfoNotFound")
const Info = require("../models/Info")
const Permission = require("../enum/Permission")

class InfoService {

    constructor({InfoModel}) {
        this.Info = InfoModel
        this.createInfo = this.createInfo.bind(this)
        this.changeInfo = this.changeInfo.bind(this)
        this.deleteInfo = this.deleteInfo.bind(this)
        this.getInfoById = this.getInfoById.bind(this)
        this.getInfo = this.getInfo.bind(this)
        this.getAllInfo = this.getAllInfo.bind(this)
    }

    async createInfo(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        const {date, text, link, header, active} = input

        const info = new Info()
        info.date = date
        info.text = text
        info.link = link
        info.header = header
        info.active = active

        return await this.Info.create(info)
    }

    async changeInfo(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        const {id, date, text, link, header, active} = input
        const info =  await this.Info.findOne({
            where: {
                id
            }
        })
        if (!info) {
            throw new InfoNotFound()
        }

        info.date = date
        info.text = text
        info.link = link
        info.header = header
        info.active = active

        return await info.save()
    }


    async deleteInfo(id, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        const info =  await this.Info.findOne({
            where: {
                id
            }
        })
        if (!info) {
            throw new InfoNotFound()
        }



        return await info.destroy()
    }

    async getInfoById(id, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        return await this.Info.findOne({
            where: {
                id
            }
        })

    }


    async getInfo(user) {
        if (!user || !user.checkPermission(Permission.GET_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.Info.findAll({
            where: {
                active: 1
            }
        })
    }
    async getAllInfo(user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.Info.findAll()
    }

}

module.exports = InfoService
