const NotAuthorized = require("../errors/NotAuthorized")
const InstrNotFound = require("../errors/InstrNotFound")
const Instr = require("../models/Instr")
const Permission = require("../enum/Permission")

class InstrService {

    constructor({InstrModel}) {
        this.Instr = InstrModel
        this.createInstr = this.createInstr.bind(this)
        this.changeInstr = this.changeInstr.bind(this)
        this.deleteInstr = this.deleteInstr.bind(this)
        this.getInstrById = this.getInstrById.bind(this)
        this.getInstr = this.getInstr.bind(this)
        this.getAllInstr = this.getAllInstr.bind(this)
    }

    async createInstr(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        const {date, text, link, header, active} = input

        const instr = new Instr()
        instr.date = date
        instr.text = text
        instr.link = link
        instr.header = header
        instr.active = active

        return await this.Instr.create(instr)
    }

    async changeInstr(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        const {id, date, text, link, header, active} = input
        const instr =  await this.Instr.findOne({
            where: {
                id
            }
        })
        if (!instr) {
            throw new InstrNotFound()
        }

        instr.date = date
        instr.text = text
        instr.link = link
        instr.header = header
        instr.active = active

        return await instr.save()
    }


    async deleteInstr(id, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        const instr =  await this.Instr.findOne({
            where: {
                id
            }
        })
        if (!instr) {
            throw new InstrNotFound()
        }



        return await instr.destroy()
    }

    async getInstrById(id, user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }
        return await this.Instr.findOne({
            where: {
                id
            }
        })

    }


    async getInstr(user) {
        if (!user || !user.checkPermission(Permission.GET_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.Instr.findAll({
            where: {
                active: 1
            }
        })
    }
    async getAllInstr(user) {
        if (!user || !user.checkPermission(Permission.CREATE_NEWS)) {
            throw new NotAuthorized()
        }

        return await this.Instr.findAll()
    }

}

module.exports = InstrService
