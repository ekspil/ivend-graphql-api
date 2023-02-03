const UserDTO = require("../../models/dto/UserDTO")
const ActDTO = require("../../models/dto/ActDTO")
const ManagerDTO = require("../../models/dto/ManagerDTO")
const BankPaymentDTO = require("../../models/dto/BankPaymentDTO")
const AdminStatisticDTO = require("../../models/dto/AdminStatisticDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const UserNotFound = require("../../errors/UserNotFound")

function UserQueries({userService, billingService}) {



    const getAllBills = async (obj, args, context) => {
        const {user} = context
        const {input} = args

        const data = await billingService.getAllBills(input, user)

        const {transactions} = data


        const result = transactions.map(deposit => { 
            const transaction = new BankPaymentDTO({
                id: deposit.id,
                applied: true,
                createdAt: deposit.createdAt,
                userId: deposit.userId,
                userName: deposit.user.companyName,
                userInn: deposit.user.inn,
                amount: deposit.amount,
                type: ""
            })
        
            if (deposit.meta.includes("deposit")) {
                transaction.type = "РОБОКАССА"
            }
            if (deposit.meta.includes("admin_change_balance")) {
                transaction.type = "АДМИН"
            }
            if (deposit.meta.includes("BANK_PAYMENT")) {
                transaction.type = "БАНК"
            }
            return transaction
            
        }
        )

        return result
    }


    const getProfile = async (root, args, context) => {
        const {userId} = args
        const user = await userService.getProfile(context.user, userId)

        if (!user) {
            throw new UserNotFound()
        }

        return new UserDTO(user)
    }
    const getManagers = async (root, args, context) => {
        const managers = await userService.getManagers(context.user)

        if (!managers) {
            return []
        }

        return managers.map(manager => new ManagerDTO(manager))
    }

    const getAdminStatistic = async (root, args, context) => {
        const data = await userService.getAdminStatistic(context.user)

        if (!data) {
            throw new UserNotFound()
        }

        return new AdminStatisticDTO(data)
    }

    const getOrangeStatistic = async (root, args, context) => {
        const {userId} = args
        const data = await billingService.getOrangeStatistic(context.user, userId || context.user.id)

        if (!data) {
            return {orangeFixSum: 0}
        }

        return {orangeFixSum: data}
    }

    const getAllUsers = async (root, args, context) => {
        const {input, orderDesc, orderKey, search, partnerId, managerId} = args
        const users = await userService.getAllUsers(input, context.user, orderDesc, orderKey, search, partnerId, managerId)

        return users.map(user => (new UserDTO(user)))
    }

    const getActs = async (root, args, context) => {
        const {userId} = args
        const acts = await billingService.getActs(userId, context.user)

        return acts.map(act => (new ActDTO(act)))
    }


    const getLegalInfoByUserId = async (root, args, context) => {
        const {user} = context
        const {id} = args
        const legalInfo = await userService.getLegalInfoByUserId(id, user)

        if (!legalInfo) {
            return null
        }

        return new LegalInfoDTO(legalInfo)
    }

    return {
        getProfile,
        getAllUsers,
        getLegalInfoByUserId,
        getAdminStatistic,
        getAllBills,
        getOrangeStatistic,
        getManagers,
        getActs
    }

}

module.exports = UserQueries

