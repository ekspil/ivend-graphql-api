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
        equipment.machineTypeId = createControllerInput.machineTypeId


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
        const {limit, offset} = input

        return await this.Sim.findAll({
            limit,
            offset
        })
    }
}

module.exports = EquipmentService
