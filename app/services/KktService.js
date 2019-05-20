const NotAuthorized = require("../errors/NotAuthorized")
const KktNotFound = require("../errors/KktNotFound")
const Kkt = require("../models/Kkt")
const Permission = require("../enum/Permission")

class KktService {

    constructor({KktModel}) {
        this.Kkt = KktModel

        this.createKkt = this.createKkt.bind(this)
        this.editKkt = this.editKkt.bind(this)
        this.getKktById = this.getKktById.bind(this)
        this.getUserKkts = this.getUserKkts.bind(this)
        this.getAllKkts = this.getAllKkts.bind(this)
        this.kktPlusBill = this.kktPlusBill.bind(this)
        this.deleteKkt = this.deleteKkt.bind(this)

    }

    async deleteKkt(id, user) {
        if (!user || !user.checkPermission(Permission.DELETE_KKT)) {
            throw new NotAuthorized()
        }

        const kkt = await this.getKktById(id, user)

        if (!kkt) {
            throw new KktNotFound()
        }

        return await kkt.destroy()
    }

    async createKkt(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_KKT)) {
            throw new NotAuthorized()
        }

        const {kktModel, inn, companyName} = input

        const kkt = new Kkt()
        kkt.kktModel = kktModel
        kkt.inn = inn
        kkt.companyName = companyName
        kkt.user_id = user.id
        kkt.kktBillsCount = 0

        return await this.Kkt.create(kkt)
    }

    async editKkt(input, user) {
        if (!user || !user.checkPermission(Permission.UPDATE_KKT)) {
            throw new NotAuthorized()
        }

        const {id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName} = input

        const kkt = await this.Kkt.findOne({
            where: {
                id: id
            }
        })
        if (!kkt) {
            throw new KktNotFound()
        }

        kkt.kktModel = kktModel
        kkt.inn = inn
        kkt.companyName = companyName
        kkt.kktFactoryNumber = kktFactoryNumber
        kkt.kktRegNumber = kktRegNumber
        kkt.kktFNNumber = kktFNNumber
        kkt.kktActivationDate = kktActivationDate
        if(kktBillsCount){
            kkt.kktBillsCount = kktBillsCount
        }
        if(kktOFDRegKey) {
            kkt.kktOFDRegKey = kktOFDRegKey
        }

        return await kkt.save()
    }

    async kktPlusBill(fn, user) {
        if (!user || !user.checkPermission(Permission.GET_USER_KKTS)) {
            throw new NotAuthorized()
        }

        const kkt = await this.Kkt.findOne({
            where: {
                kktFNNumber: fn
            }
        })
        if (!kkt) {
            throw new KktNotFound()
        }


        return await kkt.increment("kktBillsCount")
    }

    async getKktById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_KKT_BY_ID)) {
            throw new NotAuthorized()
        }


        return await this.Kkt.findOne({
            where: {
                id: id
            }
        })
    }

    async getUserKkts(user) {
        if (!user || !user.checkPermission(Permission.GET_USER_KKTS)) {
            throw new NotAuthorized()
        }

        return await this.Kkt.findAll({
            where: {
                user_id: user.id
            }
        })
    }

    async getAllKkts(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_KKTS)) {
            throw new NotAuthorized()
        }

        return await this.Kkt.findAll({})
    }

}

module.exports = KktService
