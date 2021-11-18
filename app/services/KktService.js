const NotAuthorized = require("../errors/NotAuthorized")
const KktNotFound = require("../errors/KktNotFound")
const Kkt = require("../models/Kkt")
const Permission = require("../enum/Permission")
const microservices = require("../utils/microservices")
const fetch = require("node-fetch")

class KktService {

    constructor({KktModel, redis, MachineModel, SaleModel, LegalInfoModel, ButtonItemModel}) {
        this.Kkt = KktModel
        this.Machine = MachineModel
        this.Sale = SaleModel
        this.LegalInfo = LegalInfoModel
        this.ButtonItem = ButtonItemModel
        this.redis = redis


        this.getStatus = function getStatus(field){
            //Проверку оставшихся дней после того как установлю формат
            if(field.action === "DELETE"){
                return 6
            }
            if(!field.kktActivationDate){
                return 4
            }
            let date =new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let yearF = field.kktActivationDate.replace(/[,-/ ]/g, ".").split(".")[2]
            let monthF = field.kktActivationDate.replace(/[,-/ ]/g, ".").split(".")[1]

            if(field.kktModel === "УМКА-01-ФА (ФН36)"){



                if(year - yearF >= 3 && month - monthF <=0){
                    return 5
                }
                if(Number(field.kktBillsCount) > 230000){
                    return 5
                }
                if(year - yearF >= 3 && month - monthF == 1){
                    return 3
                }
                if(Number(field.kktBillsCount) > 220000){
                    return 3
                }
            }
            if(field.kktModel === "УМКА-01-ФА (ФН15)"){
                if(year - yearF >= 1 && month - monthF >=3){
                    return 5
                }
                if(Number(field.kktBillsCount) > 230000){
                    return 5
                }
                if(year - yearF >= 1 && month - monthF >=2){
                    return 3
                }
                if(Number(field.kktBillsCount) > 220000){
                    return 3
                }
            }
            if(field.kktLastBill){
                let da = new Date(field.kktLastBill).getTime()
                let dn = new Date()
                if (da < (dn - (1000 * 60 * 60 * 24 * 10))) {
                    return 3
                }
            }




            return 0
        }

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

    async userDeleteKkt(id, user) {
        if (!user || !user.checkPermission(Permission.UPDATE_KKT)) {
            throw new NotAuthorized()
        }

        const kkt = await this.getKktById(id, user)

        if (!kkt) {
            throw new KktNotFound()
        }

        kkt.action = "DELETE"

        return await kkt.save()
    }

    async createKkt(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_KKT)) {
            throw new NotAuthorized()
        }

        const {kktModel, inn, companyName, rekassaNumber, rekassaPassword, type} = input

        const kkt = new Kkt()
        kkt.kktModel = kktModel
        kkt.inn = inn
        kkt.companyName = companyName
        kkt.user_id = user.id
        kkt.kktBillsCount = 0

        kkt.rekassaNumber = rekassaNumber
        kkt.rekassaPassword = rekassaPassword
        kkt.type = type

        if(type === "rekassa") {

            const data = {
                number: rekassaNumber,
                password: rekassaPassword
            }

            const response = await fetch(`${process.env.REKASSA_URL}/api/auth/login?apiKey=${process.env.REKASSA_APIKEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            let token

            switch (response.status) {
                case 200: {
                    token = await response.text()
                    break
                }
                default:
                    throw new Error("Cannot login, unknown status code: " + response.status)
            }



            const response2 = await fetch(`${process.env.REKASSA_URL}/api/crs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })

            let kktId

            switch (response2.status) {
                case 200: {
                    kktId = (await response2.json())._embedded.userCashRegisterRoles[0].cashRegister.id
                    break
                }
                default:
                    throw new Error("Cannot login, unknown status code: " + response2.status)
            }

            kkt.rekassaKktId = kktId
            kkt.kktActivationDate = new Date().toLocaleDateString()
            kkt.kktOFDRegKey = 1
            kkt.kktRegNumber = rekassaNumber
            kkt.kktFactoryNumber = rekassaNumber



        }

        if(user.step < 7){
            user.step = 7
            await user.save()
        }

        return await this.Kkt.create(kkt)
    }

    async editKkt(input, user) {
        if (!user || !user.checkPermission(Permission.UPDATE_KKT)) {
            throw new NotAuthorized()
        }

        const {id, kktModel, kktFactoryNumber, kktRegNumber, kktFNNumber, kktActivationDate, kktBillsCount, kktOFDRegKey, inn, companyName, server, rekassaKktId, rekassaNumber, rekassaPassword} = input

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
        kkt.rekassaKktId = rekassaKktId
        kkt.rekassaNumber = rekassaNumber
        kkt.rekassaPassword = rekassaPassword
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


    async kktPlusBill(fn, user, fd) {
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
        if(fd){
            kkt.kktBillsCount = Number(fd)
            return await kkt.save()
        }


        return await kkt.increment("kktBillsCount")
    }

    async getKktById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_KKT_BY_ID)) {
            throw new NotAuthorized()
        }


        const kkt = await this.Kkt.findOne({
            where: {
                id: id
            }
        })

        kkt.kktStatus = await microservices.fiscal.getKktStatus(kkt.kktRegNumber || kkt.rekassaNumber)

        let info = await microservices.fiscal.getKktInfo(kkt.kktRegNumber || kkt.rekassaNumber)
        if (info) {
            kkt.kktLastBill = info.createdAt
            kkt.kktBillsCount = info.fiscalDocumentNumber
        }

        return kkt
    }

    async getFiscalReceipt(receiptId) {
        // if (!user || !user.checkPermission(Permission.GET_KKT_BY_ID)) {
        //     throw new NotAuthorized()
        // }


        const saleO = await this.Sale.findOne({
            where: {
                receiptId
            }
        })


        if(!saleO){
            throw new Error("Receipt not found")
        }

        const sale = saleO.dataValues


        const buttonItem0 = await this.ButtonItem.findOne({
            where: {
                item_id: sale.item_id
            }
        })


        if(!buttonItem0){
            throw new Error("Receipt not found")
        }

        const buttonItem = buttonItem0.dataValues

        const machine = await this.Machine.findOne({
            where: {
                id: sale.machine_id
            }
        })

        if(!machine){
            throw new Error("Machine not found")
        }

        const receipt = await microservices.fiscal.getReceiptById(sale.receiptId)




        if(!receipt){
            throw new Error("Fiscal receipt not found")
        }


        const legalInfoO = await this.LegalInfo.findOne({
            where: {
                inn:receipt.inn
            }
        })
        const legalInfo = legalInfoO.dataValues

        return {
            id: sale.receiptId,
            inn: receipt.inn,
            legalAddress: legalInfo.legalAddress,
            companyName: legalInfo.companyName,
            email: legalInfo.contactEmail,
            kpp: legalInfo.kpp,
            itemType: buttonItem.type,
            sno: legalInfo.sno,
            place: machine.place,
            machineNumber: machine.number,
            ...receipt.fiscalData,
            sale
        }


    }

    async getUserKkts(user, id) {
        if (!user || !user.checkPermission(Permission.GET_USER_KKTS)) {
            throw new NotAuthorized()
        }

        const {sequelize} = this.Kkt
        const {Op} = sequelize

        if(id){
            return await this.Kkt.findAll({
                where: {
                    user_id: id
                }
            })
        }

        const answer =  await this.Kkt.findAll({
            where: {
                [Op.and]: [
                    { user_id: user.id }]
                // user_id: user.id,
                // action: {
                //     [Op.ne]: "DELETE"
                // }
            },
            order: [
                ["id", "DESC"],
            ]
        })


        for (let kkt of answer){

            let status = await microservices.fiscal.getKktStatus(kkt.kktRegNumber || kkt.rekassaNumber)

            kkt.kktStatus = status

            let info = await microservices.fiscal.getKktInfo(kkt.kktRegNumber || kkt.rekassaNumber)
            if (info) {
                kkt.kktLastBill = info.createdAt
                kkt.kktBillsCount = info.fiscalDocumentNumber
            }
        }

        return answer
    }

    async getAllKkts(offset, limit, status, user) {
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
        let filtredKkts
        if(status !== undefined){
            filtredKkts = kkts.filter(kkt => this.getStatus(kkt) === status)
        }else{
            filtredKkts = kkts
        }

        for (let kkt of filtredKkts){
            // const machines = await this.Machine.findAll({
            //     where: {
            //         kktId: kkt.id
            //     }
            // })
            // if(machines){
            //     let ok = 0
            //     let not = 0
            //     for( let machine of machines){
            //         let status = await this.redis.get("kkt_status_" + kkt.id)
            //         if (status == "ERROR") not++
            //         if (status == "OK") ok++
            //     }
            //     if(not > 0 && ok === 0) {kkt.kktStatus = "ERROR"}
            //     else if(not === 0 && ok > 0) {kkt.kktStatus = "OK"}
            //     else {kkt.kktStatus = "NOT_OK"}
            //
            // }

            let status = await microservices.fiscal.getKktStatus(kkt.kktRegNumber || kkt.rekassaNumber)

            kkt.kktStatus = status

            let info = await microservices.fiscal.getKktInfo(kkt.kktRegNumber || kkt.rekassaNumber)
            if (info) {
                kkt.kktLastBill = info.createdAt
                kkt.kktBillsCount = info.fiscalDocumentNumber
            }
        }

        return filtredKkts
    }

}

module.exports = KktService
