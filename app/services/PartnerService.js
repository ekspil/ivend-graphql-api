const NotAuthorized = require("../errors/NotAuthorized")
const PdfGenerationFailed = require("../errors/PdfGenerationFailed")
const Permission = require("../enum/Permission")
const fetch = require("node-fetch")
const {Op} = require("sequelize")
const logger = require("my-custom-logger")

class PartnerService {

    constructor({UserModel, PartnerSettingsModel, PartnerFeeModel, TariffModel, PartnerInfosModel}) {
        this.User = UserModel
        this.PartnerSettings = PartnerSettingsModel
        this.PartnerFee = PartnerFeeModel
        this.PartnerInfos = PartnerInfosModel
        this.Tariff = TariffModel

        this.changeFee = this.changeFee.bind(this)
        this.getUserPartnerFee = this.getUserPartnerFee.bind(this)
        this.createFeeTransaction = this.createFeeTransaction.bind(this)
        this.getPartnerPayments = this.getPartnerPayments.bind(this)
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
    async createFeeTransaction(input, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }
        const {userId, partnerId, controllerFee, kkmFee, terminalFee} = input
        return await this.PartnerFee.create({controllerFee, kkmFee, terminalFee, userId, partnerId})
    }

    async successFeeTransaction(id, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }
        try{

            const fee = await this.PartnerFee.findByPk(id)
            fee.status = "SUCCESS"
            await fee.save()
            return true
        }
        catch (e) {
            return false
        }
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
    async getTariffs(partnerId, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }
        const where = {}
        if(partnerId) {
            where.partnerId = partnerId
        }
        return await this.Tariff.findAll({
            where,
            order: [
                ["id", "DESC"],
            ]
        })

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
    async getPartnerPayments(period, user) {
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
        where.partnerId = user.id
        where.controllerFee = {
            [Op.lt]: 0
        }


        const transactions = await this.PartnerFee.findAll({
            where
        })

        return transactions

    }
    async updatePartnerInfo(input, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }
        const {partnerId, fileLogo, fileOferta, infoPhoneTech, infoPhoneCom, infoMailTech, infoRequisites} = input

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
        settings.infoMailTech = infoMailTech

        return settings.save()

    }
    async getUserPartnerFee(userId, period, user, role) {
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

        if(role === "PARTNER"){
            where.userId = userId
        }
        else {
            where.partnerId = userId
        }


        const transactions = await this.PartnerFee.findAll({
            where
        })

        const amount = transactions.reduce((acc, item) => {
            return (acc + Number(item.controllerFee) + Number(item.terminalFee) + Number(item.kkmFee))
        }, 0)
        return amount
    }




    async generatePartnerAct(actId, user) {
        if (!user || !user.checkPermission(Permission.CREATE_ITEM)) {
            throw new NotAuthorized()
        }

        const act = await this.PartnerFee.findByPk(actId)

        const month = new Date(act.createdAt).getUTCMonth()
        const year = new Date(act.createdAt).getUTCFullYear()

        const to = new Date(act.createdAt)
        to.setUTCFullYear(year)
        to.setUTCMonth(month)
        to.setUTCDate(0)
        to.setUTCHours(23)
        to.setUTCMinutes(59)
        to.setUTCSeconds(59)
        const from = new Date()
        from.setUTCFullYear(year)
        from.setUTCMonth(month -1)
        from.setUTCDate(1)
        from.setUTCHours(0)
        from.setUTCMinutes(0)
        from.setUTCSeconds(0)


        const body = {
            inn: user.inn,
            userId: act.userId,
            companyName: user.companyName,
            amount: act.controllerFee,
            id: actId,
            to: to.toLocaleDateString(),
            from: from.toLocaleDateString(),

        }




        const response = await fetch(`${process.env.EXCEL_URL}/api/v1/pdf/generatePartnerAct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (!(response.status === 200)) {
            logger.error("Unexpected status code returned from PDF microservice: " + response.status)
            throw new PdfGenerationFailed()
        }

        const {id} = await response.json()


        return {url: `${process.env.EXCEL_URL}/api/v1/pdf/act/${id}`}
    }

    async getUserPartnerInfo(partner, period, user) {
        if (!user || !user.checkPermission(Permission.PARTNER)) {
            throw new NotAuthorized()
        }

        if (partner.role !== "PARTNER") return null

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
        where.controllerFee = {
            [Op.lt]: 0
        }
        where.partnerId = partner.id


        const transactions = await this.PartnerFee.findAll({
            where,
            order: [
                ["id", "DESC"]
            ]
        })

        if(!transactions || transactions.length === 0) return null

        const amount = transactions.reduce((acc, item) => {
            if(item.status === "WAITING") {
                return acc
            }
            const sum =  (acc.sum + Number(item.controllerFee) + Number(item.terminalFee) + Number(item.kkmFee))
            const count = acc.count +1

            return {
                sum,
                count
            }

        }, {sum: 0, count: 0})





        return {
            lastPayment: transactions[0].createdAt,
            lastPaymentAmount: transactions[0].controllerFee,
            lastPaymentStatus: transactions[0].status || "SUCCESS",
            lastPaymentId: transactions[0].id,
            payments: amount.count,
            paymentsAmount: amount.sum,
        }
    }


}

module.exports = PartnerService
