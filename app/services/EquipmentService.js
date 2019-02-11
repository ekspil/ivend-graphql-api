const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const Equipment = require("../models/Equipment")

class EquipmentService {

    constructor({EquipmentModel}) {
        this.Equipment = EquipmentModel

        this.createEquipment = this.createEquipment.bind(this)
        this.findById = this.findById.bind(this)
    }

    async createEquipment(createControllerInput, user) {
        if (!user || !user.checkPermission(Permission.WRITE_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const equipment = new Equipment()
        equipment.name = createControllerInput.name

        return await this.Equipment.create(equipment)
    }

    async findById(id, user) {
        if (!user || !user.checkPermission(Permission.READ_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        return await this.Equipment.findOne({
            where: {
                id
            }
        })
    }
}

module.exports = EquipmentService
