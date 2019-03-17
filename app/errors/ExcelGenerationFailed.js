class ExcelGenerationFailed extends Error {

    constructor() {
        super()

        this.message = "Failed to generate excel file"
    }
}

module.exports = ExcelGenerationFailed
