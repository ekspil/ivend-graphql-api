const UserDTO = require("../../models/dto/UserDTO")
const BankPaymentDTO = require("../../models/dto/BankPaymentDTO")
const AdminStatisticDTO = require("../../models/dto/AdminStatisticDTO")
const LegalInfoDTO = require("../../models/dto/LegalInfoDTO")
const UserNotFound = require("../../errors/UserNotFound")

function UserQueries({userService, billingService}) {



    const getAllBills = async (obj, args, context) => {
        const {user} = context
        const {input} = args

        const data = await billingService.getAllBills(input, user)

        const {bills, deposits} = data


        const result = bills.map(deposit => (new BankPaymentDTO({
            id: deposit.id,
            applied: deposit.applied,
            createdAt: deposit.createdAt,
            userId: deposit.userId,
            userName: deposit.user.companyName,
            userInn: deposit.user.inn,
            amount: deposit.amount,
            type: "BANK"
        })))


        for ( let deposit of deposits){
            const d = {
                id: deposit.id + "user",
                applied: false,
                createdAt: deposit.createdAt,
                userId: deposit.user.id,
                userName: deposit.user.companyName,
                userInn: deposit.user.inn,
                amount: deposit.amount,
                type: "ROBOKASSA"
            }

            if(deposit.paymentRequest && (deposit.paymentRequest.status === "SUCCEEDED" || deposit.paymentRequest.status === "ADMIN_EDIT")){
                d.applied = true
            }
            if(deposit.paymentRequest && deposit.paymentRequest.status === "ADMIN_EDIT"){
                d.type = "ADMIN"
            }
            result.push(d)
        }
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

    const getAdminStatistic = async (root, args, context) => {
        const data = await userService.getAdminStatistic(context.user)

        if (!data) {
            throw new UserNotFound()
        }

        return new AdminStatisticDTO(data)
    }

    const getAllUsers = async (root, args, context) => {
        const {input, orderDesc, orderKey, search} = args
        const users = await userService.getAllUsers(input, context.user, orderDesc, orderKey, search)

        return users.map(user => (new UserDTO(user)))
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
        getAllBills
    }

}

module.exports = UserQueries

