const EncashmentDTO = require("../../models/dto/EncashmentDTO")

function EncashmentResolver({machineService}) {


    const prevEncashment = async (obj, args, context) => {
        const {user} = context

        const encashment = await machineService.getEncashmentById(obj.id, user)

        if (!encashment.prevEncashmentId) {
            return null
        }

        const prevEncashment = await machineService.getEncashmentById(encashment.prevEncashmentId, user)

        return new EncashmentDTO(prevEncashment)
    }

    return {
        prevEncashment
    }

}

module.exports = EncashmentResolver

