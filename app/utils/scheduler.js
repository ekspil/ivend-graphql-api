const cron = require("node-cron")

const scheduleTasks = async ({UserModel, services}) => {


    // auto order send
    cron.schedule("* * 1 * *", async () => {
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
                services: [{count: 1, price: amount, name: "Рекомендуемый платеж за услуги IVEND за месяц"}]
            }
            await services.reportService.generatePdf(input, user, true)
        }
    })

}

module.exports = {
    scheduleTasks
}
