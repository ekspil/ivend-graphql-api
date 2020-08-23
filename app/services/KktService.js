const NotAuthorized = require("../errors/NotAuthorized")
const KktNotFound = require("../errors/KktNotFound")
const Kkt = require("../models/Kkt")
const Permission = require("../enum/Permission")

class KktService {

    constructor({KktModel, redis, MachineModel}) {
        this.Kkt = KktModel
        this.Machine = MachineModel
        this.redis = redis

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

        const {id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName, server} = input

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
        if(server) {
            kkt.server = server
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

    async getAllKkts(offset, limit, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_KKTS)) {
            throw new NotAuthorized()
        }

        if (!limit) {
            limit = 50
        }


        const kkts = await this.Kkt.findAll({
            offset,
            limit,
            order: [
                ["id", "DESC"],
            ]
        })

        for (let kkt of kkts){
            const machines = await this.Machine.findAll({
                where: {
                    kktId: kkt.id
                }
            })
            if(machines){
                let ok = 0
                let not = 0
                for( let machine of machines){
                    let status = await this.redis.get("kkt_status_" + machine.id)
                    if (status == "ERROR") not++
                    if (status == "OK") ok++
                }
                if(not > 0 && ok === 0) {kkt.kktStatus = "ERROR"}
                else if(not === 0 && ok > 0) {kkt.kktStatus = "OK"}
                else {kkt.kktStatus = "NOT_OK"}

            }
        }

        return kkts
    }

}

module.exports = KktService
