const NotAuthorized = require("../errors/NotAuthorized")
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

        return await this.Kkt.create(kkt)
    }

    async editKkt(input, user) {
        if (!user || !user.checkPermission(Permission.UPDATE_KKT)) {
            throw new NotAuthorized()
        }

        const {id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName} = input

        const kkt = new Kkt()

        kkt.kktModel = kktModel
        kkt.inn = inn
        kkt.companyName = companyName
        kkt.kktFactoryNumber = kktFactoryNumber
        kkt.kktRegNumber = kktRegNumber
        kkt.kktFNNumber = kktFNNumber
        kkt.kktActivationDate = kktActivationDate
        kkt.kktBillsCount = kktBillsCount
        kkt.kktOFDRegKey = kktOFDRegKey


        return await this.Kkt.update(kkt, {
            where: {
                id: id
            }
        })
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
            throw new Error("kkt is not set")
        }


        return await kkt.update({kktBillsCount: Number(kkt.kktBillsCount) + 1}, {
            where: {
                kktFNNumber: fn
            }
        })
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
