const KktDTO = require("../../models/dto/KktDTO")
const FiscalReceiptDTO = require("../../models/dto/FiscalReceiptDTO")

function KktQueries({kktService}) {

    const getAllKkts = async (root, args, context) => {

        const {user} = context

        const {offset, limit, status} = args

        const kkts = await kktService.getAllKkts(offset, limit, status, user)

        if (!kkts) {
            return null
        }

        return kkts.map(kkt => (new KktDTO(kkt)))

    }

    const getUserKkts = async (root, args, context) => {

        const {user} = context

        const kkts = await kktService.getUserKkts(user)

        if (!kkts) {
            return null
        }

        return kkts.map(kkt => (new KktDTO(kkt)))

    }

    const getKktById = async (root, args, context) => {
        const {id} = args
        const {user} = context

        const kkt = await kktService.getKktById(id, user)

        if (!kkt) {
            return null
        }

        return new KktDTO(kkt)
    }

    const getFiscalReceipt = async (root, args) => {
        const {receiptId} = args

        const Receipt = await kktService.getFiscalReceipt(receiptId)

        if (!Receipt) {
            return null
        }

        return new FiscalReceiptDTO(Receipt)
    }

    return {
        getAllKkts,
        getUserKkts,
        getKktById,
        getFiscalReceipt
    }

}

module.exports = KktQueries

