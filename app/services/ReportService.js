const NotAuthorized = require("../errors/NotAuthorized")
const ExcelGenerationFailed = require("../errors/ExcelGenerationFailed")
const PdfGenerationFailed = require("../errors/PdfGenerationFailed")
const Permission = require("../enum/Permission")
const fetch = require("node-fetch")
const logger = require("my-custom-logger")
const microservices = require("../utils/microservices")

class ReportService {

    constructor({redis, BankPaymentsModel, ActsModel}) {
        this.redis = redis
        this.BankPayments = BankPaymentsModel
        this.Acts = ActsModel
        this.generateExcel = this.generateExcel.bind(this)
    }


    async generateExcel(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_ITEM)) {
            throw new NotAuthorized()
        }

        //todo validation
        const body = input.rows.map(row => {
            return row.cells.map(cell => {
                return cell
            })
        })

        const response = await fetch(`${process.env.EXCEL_URL}/api/v1/excel/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (!(response.status === 200)) {
            logger.error("Unexpected status code returned from Excel microservice: " + response.status)
            throw new ExcelGenerationFailed()
        }

        const {id} = await response.json()

        return {url: `${process.env.EXCEL_URL}/api/v1/excel/${id}`}
    }

    async generatePdf(input, user, toUser) {
        if (!user || !user.checkPermission(Permission.CREATE_ITEM)) {
            throw new NotAuthorized()
        }

        const body = input


        const bankPayment = await this.BankPayments.create({
            applied: false,
            userId: user.id,
            amount: body.amount,
        })

        body.orderNumber = String(bankPayment.id)


        const response = await fetch(`${process.env.EXCEL_URL}/api/v1/pdf/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (!(response.status === 200)) {
            logger.error("Unexpected status code returned from PDF microservice: " + response.status)
            throw new PdfGenerationFailed()
        }

        const {id} = await response.json()
        input.url = `${process.env.EXCEL_URL}/api/v1/pdf/${id}`

        if(toUser){
            await microservices.notification.sendEmailOrder(input, user, true)
        }
        else {
            await microservices.notification.sendEmailOrder(input, user)
        }

        return {url: `${process.env.EXCEL_URL}/api/v1/pdf/${id}`}
    }

    async generateAct(actId, user) {
        if (!user || !user.checkPermission(Permission.CREATE_ITEM)) {
            throw new NotAuthorized()
        }

        const act = await this.Acts.findByPk(actId)
        const body = {
            inn: user.inn,
            companyName: user.companyName,
            amount: act.sum,
            id: actId
        }




        const response = await fetch(`${process.env.EXCEL_URL}/api/v1/pdf/generateAct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if (!(response.status === 200)) {
            logger.error("Unexpected status code returned from PDF microservice: " + response.status)
            throw new PdfGenerationFailed()
        }

        const {id} = await response.json()


        return {url: `${process.env.EXCEL_URL}/api/v1/pdf/act/${id}`}
    }

}

module.exports = ReportService
