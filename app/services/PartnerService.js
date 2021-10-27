const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")
const {Op} = require("sequelize")

class PartnerService {

    constructor({UserModel, PartnerSettingsModel, PartnerFeeModel, TariffModel, PartnerInfosModel}) {
        this.User = UserModel
        this.PartnerSettings = PartnerSettingsModel
        this.PartnerFee = PartnerFeeModel
        this.PartnerInfos = PartnerInfosModel
        this.Tariff = TariffModel

        this.changeFee = this.changeFee.bind(this)
        this.getUserPartnerFee = this.getUserPartnerFee.bind(this)
    }


    async changeFee(input, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }
        const {userId, controllerFee, kkmFee, terminalFee} = input

        let settings = await this.PartnerSettings.findOne({
            where: {
                userId
            }
        })
        if(!settings){
            settings = await this.PartnerSettings.create({controllerFee: 0, kkmFee: 0, terminalFee: 0, userId})
        }
        settings.controllerFee = controllerFee
        settings.kkmFee = kkmFee
        settings.terminalFee = terminalFee
        await settings.save()
            

        return settings
    }
    async getFee(userId, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }

        let settings = await this.PartnerSettings.findOne({
            where: {
                userId
            }
        })
        if(!settings){
            throw new Error("No partner settings")
        }


        return settings
    }
    async getPartnerInfo(partnerId, user) {
        if (!user || !user.checkPermission(Permission.GET_PROFILE)) {
            throw new NotAuthorized()
        }

        let settings = await this.PartnerInfos.findOne({
            where: {
                partnerId
            }
        })
        if(!settings){
            throw new Error("No partner settings")
        }


        return settings
    }
    async getPartnerVendors(userId, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }

        const where = {}
        where.partnerId = userId
        return await this.User.findAll({where})

    }
    async getTariffs(user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }

        return await this.Tariff.findAll()

    }
    async getTariff(partnerId, user) {
        if (!user || !user.checkPermission(Permission.GET_PROFILE)) {
            throw new NotAuthorized()
        }

        return await this.Tariff.findOne({
            where: {
                partnerId,
            },
            order: [
                ["id", "DESC"],
            ]
        })

    }
    async createTariff(input, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }

        return this.Tariff.create(input)

    }
    async updatePartnerInfo(input, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }
        const {partnerId, fileLogo, fileOferta, infoPhoneTech, infoPhoneCom, infoRequisites} = input

        let settings = await this.PartnerInfos.findOne({
            where: {
                partnerId
            }
        })
        if(!settings){
            return this.PartnerInfos.create(input)
        }

        settings.fileLogo = fileLogo
        settings.fileOferta = fileOferta
        settings.infoPhoneTech = infoPhoneTech
        settings.infoPhoneCom = infoPhoneCom
        settings.infoRequisites = infoRequisites

        return settings.save()

    }
    async getUserPartnerFee(userId, period, user) {
        if (!user || !user.checkPermission(Permission.PARTNER)) {
            throw new NotAuthorized()
        }
        const where = {}
        if (period) {
            const {from, to} = period

            if (from > to) {
                throw new Error("Invalid Period")
            }

            where.createdAt = {
                [Op.lt]: to,
                [Op.gt]: from
            }
        }

        where.user_id = userId

        const transactions = await this.PartnerFee.findAll({
            where
        })

        const amount = transactions.reduce((acc, item) => {
            return (acc + Number(item.controllerFee) + Number(item.terminalFee) + Number(item.kkmFee))
        }, 0)
        return amount
    }


}

module.exports = PartnerService
