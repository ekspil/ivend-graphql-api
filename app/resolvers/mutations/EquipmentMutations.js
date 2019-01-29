const EquipmentDTO = require("../../models/dto/EquipmentDTO")

function EquipmentMutations({equipmentService}) {

    const createEquipment = async (root, args, context) => {
        const {input} = args
        const {user} = context

        const equipment = await equipmentService.createEquipment(input, user)

        return new EquipmentDTO(equipment)
    }

    return {
        createEquipment
    }

}

module.exports = EquipmentMutations

