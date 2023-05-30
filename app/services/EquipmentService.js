const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const Equipment = require("../models/Equipment")


class EquipmentService {

    constructor({EquipmentModel, SimsModel}) {
        this.Equipment = EquipmentModel
        this.Sim = SimsModel

        this.createEquipment = this.createEquipment.bind(this)
        this.findById = this.findById.bind(this)
    }

    async createEquipment(createControllerInput, user) {
        if (!user || !user.checkPermission(Permission.CREATE_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const equipment = new Equipment()
        equipment.name = createControllerInput.name
        equipment.machine_type_id = createControllerInput.machineTypeId


        return await this.Equipment.create(equipment)
    }

    async findById(id, user) {
        if (!user || !user.checkPermission(Permission.FIND_EQUIPMENT_BY_ID)) {
            throw new NotAuthorized()
        }

        return await this.Equipment.findOne({
            where: {
                id
            }
        })
    }

    async getAllEquipments(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_EQUIPMENTS)) {
            throw new NotAuthorized()
        }

        return await this.Equipment.findAll()
    }

    async getAllSims(input, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_SIMS)) {
            throw new NotAuthorized()
        }
        const {sequelize} = this.Sim
        const {Op} = sequelize

        const {limit, offset, status, search} = input
        let where = {}

        if(search && search.length > 3){
            where = {
                [Op.or]: [
                    { controllerUid: {
                        [Op.like]: `%${search}%`
                    } },
                    { userName: {
                        [Op.like]: `%${search}%`
                    } },
                    { number: {
                        [Op.like]: `%${search}%`
                    } },
                    { imsi: {
                        [Op.like]: `%${search}%`
                    } }
                ]
            }

        }

        if(status === "active"){
            where.traffic = {
                [Op.gte]: 0.001
            }
        }
        else if(status === "not_active"){
            where.traffic = {
                [Op.lt]: 0.001
            }
        }

        

        return await this.Sim.findAll({
            limit,
            offset,
            where,
            order: [
                ["traffic", "DESC"]
            ]
        })
    }
}

module.exports = EquipmentService
