const cron = require("node-cron")
const microservices = require("../utils/microservices")
const logger = require("my-custom-logger")

const servs = async(controllers, user,  getControllerServices) => {
    let servicesResult = []
    for(let controller of controllers){
        controller.services = await getControllerServices(controller.id, user)
        for(let service of controller.services){
            const [exist] = servicesResult.filter(serv => serv.id === service.id)
            if(!exist){
                let s = {
                    id: service.id,
                    name: service.name,
                    price: service.price,
                    count: 1
                }
                servicesResult.push(s)
            }else{
                servicesResult.map(serv => {
                    if(serv.id !== service.id) return serv
                    serv.price = serv.price + service.price
                    serv.count++
                    if(service.fixCount){
                        serv.count = service.fixCount
                        serv.price = service.price
                    }
                    return serv
                })
            }


        }
    }

    return servicesResult

}


const scheduleTasks = async ({UserModel, KktModel, services, redis}) => {



    cron.schedule("1 14 1 * *", async () => {
        // auto order send
        const started = await redis.get("auto_send_already_started")
        if(started) return
        await redis.set("auto_send_already_started", `OK`, "EX", 24 * 60 * 60)

        const users = await UserModel.findAll({
            where: {
                autoSend: true
            }
        })


        for (let user of users){
            try{

                user.checkPermission = () => true
                const controllers = await services.controllerService.getAllOfCurrentUser(user)
                const svs = await servs(controllers, user, services.controllerService.getControllerServices)




                const amount = svs.reduce((acc, i) => acc + i.price, 0)
                if(amount === 0) continue

                const input = {
                    amount,
                    inn: user.inn,
                    companyName: user.companyName,
                    prefix: "VFT",
                    services: JSON.stringify(svs)
                }
                await services.reportService.generatePdf(input, user, true)
            }
            catch (e) {
                logger.info(`graphql_error_sending_auto_order ${e.message}`)
                continue
            }
        }
    })

    // kkt information update
    cron.schedule("*/10 * * * *", async () => {

        const started = await redis.get("update_kkt_info_already_started")
        if(started) return
        await redis.set("update_kkt_info_already_started", `OK`, "EX", 60)

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
