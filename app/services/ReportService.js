const NotAuthorized = require("../errors/NotAuthorized")
const ExcelGenerationFailed = require("../errors/ExcelGenerationFailed")
const Permission = require("../enum/Permission")
const fetch = require("node-fetch")
const logger = require("../utils/logger")

class ReportService {

    constructor() {
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

}

module
    .exports = ReportService
