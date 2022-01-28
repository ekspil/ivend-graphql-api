const EquipmentDTO = require("../../models/dto/EquipmentDTO")
const SimDTO = require("../../models/dto/SimDTO")

function EquipmentQueries({equipmentService}) {

    const getEquipments = async (root, args, context) => {
        const {user} = context

        const equipments = await equipmentService.getAllEquipments(user)

        if (!equipments) {
            return null
        }

        return equipments.map(equipment => (new EquipmentDTO(equipment)))
    }

    const getAllSims = async (root, args, context) => {
        const {user} = context
        const {input} = args

        const sims = await equipmentService.getAllSims(input, user)
        if(!sims) return null

        return sims.map(sim => (new SimDTO(sim)))
    }

    return {
        getEquipments,
        getAllSims
    }

}

module.exports = EquipmentQueries

