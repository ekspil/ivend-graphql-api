class PdfGenerationFailed extends Error {

    constructor() {
        super()

        this.message = "Failed to generate pdf file"
    }
}

module.exports = PdfGenerationFailed
