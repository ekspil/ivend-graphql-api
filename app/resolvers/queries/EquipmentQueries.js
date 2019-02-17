const EquipmentDTO = require("../../models/dto/EquipmentDTO")

function EquipmentQueries({equipmentService}) {

    const getEquipments = async (root, args, context) => {
        const {user} = context

        const equipments = await equipmentService.getAllEquipments(user)

        if (!equipments) {
            return null
        }

        return equipments.map(equipment => (new EquipmentDTO(equipment)))
    }

    return {
        getEquipments
    }

}

module.exports = EquipmentQueries

