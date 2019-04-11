class RevisionNotFound extends Error {

    constructor() {
        super()

        this.message = "Revision not found"
    }
}

module.exports = RevisionNotFound
