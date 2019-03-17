class PhonePasswordMatchFailed extends Error {

    constructor() {
        super()

        this.message = "Phone and password does not match"
    }
}

module.exports = PhonePasswordMatchFailed
