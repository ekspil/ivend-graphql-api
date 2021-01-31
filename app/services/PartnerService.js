const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")
const {Op} = require("sequelize")

class PartnerService {

    constructor({UserModel, PartnerSettingsModel, PartnerFeeModel}) {
        this.User = UserModel
        this.PartnerSettings = PartnerSettingsModel
        this.PartnerFee = PartnerFeeModel

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
    async getPartnerVendors(userId, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }

        const where = {}
        where.partnerId = userId
        return await this.User.findAll({where})

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