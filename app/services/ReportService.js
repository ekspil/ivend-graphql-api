const NotAuthorized = require("../errors/NotAuthorized")
const ExcelGenerationFailed = require("../errors/ExcelGenerationFailed")
const PdfGenerationFailed = require("../errors/PdfGenerationFailed")
const Permission = require("../enum/Permission")
const fetch = require("node-fetch")
const logger = require("my-custom-logger")
const microservices = require("../utils/microservices")

class ReportService {

    constructor({redis}) {
        this.redis = redis
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

        const numOrderString = await this.redis.get("orders_number_")
        if(!numOrderString){
            await this.redis.set("orders_number_", "1")
            body.orderNumber = 1
        }
        body.orderNumber = String(Number(numOrderString) + 1)
        await this.redis.set("orders_number_", `${body.orderNumber}`)


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

        await microservices.notification.sendEmailOrder(input, user)
        if(toUser){
            await microservices.notification.sendEmailOrder(input, user, true)
        }

        return {url: `${process.env.EXCEL_URL}/api/v1/pdf/${id}`}
    }

}

module
    .exports = ReportService
