const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

const Equipment = require("../models/Equipment")

class EquipmentService {

    constructor({ equipmentRepository }) {
        this.equipmentRepository = equipmentRepository

        this.createEquipment = this.createEquipment.bind(this)
    }

    async createEquipment(createControllerInput, user) {
        if (!user || !user.checkPermission(Permission.WRITE_EQUIPMENT)) {
            throw new NotAuthorized()
        }

        const equipment = new Equipment()
        equipment.name = createControllerInput.name

        return await this.equipmentRepository.save(equipment)
    }

}

module.exports = EquipmentService
