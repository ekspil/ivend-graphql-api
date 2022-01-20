const cron = require("node-cron")
const microservices = require("../utils/microservices")
const logger = require("my-custom-logger")

const scheduleTasks = async ({UserModel, KktModel, services}) => {


    // auto order send
    cron.schedule("1 14 1 * *", async () => {
        const users = await UserModel.findAll({
            where: {
                autoSend: true
            }
        })


        for (let user of users){
            user.checkPermission = () => true
            const dayBill = await services.billingService.getDailyBill(user, user.id)
            const amount = Number((Number(dayBill) * 32).toFixed(0))

            const input = {
                amount,
                inn: user.inn,
                companyName: user.companyName,
                services: JSON.stringify([{count: 1, price: amount, name: "Рекомендуемый платеж за услуги IVEND за месяц"}])
            }
            await services.reportService.generatePdf(input, user, true)
        }
    })

    // kkt information update
    cron.schedule("*/10 * * * *", async () => {


        logger.info("graphql_scheduler_kkt_information_update_started")
        const kkts = await KktModel.findAll({
            order: [
                ["status", "ASC"],
                ["id", "DESC"],
            ]
        })

        for (let kkt of kkts){


            let info = await microservices.fiscal.getKktInfo(kkt.kktRegNumber || kkt.rekassaNumber)
            if (info) {
                kkt.kktLastBill = info.createdAt
                kkt.kktBillsCount = info.fiscalDocumentNumber
                await kkt.save()
            }
        }

        logger.info("graphql_scheduler_kkt_information_update_finished")

    })

}

module.exports = {
    scheduleTasks
}
