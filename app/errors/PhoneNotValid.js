class PhoneNotValid extends Error {

    constructor() {
        super()

        this.message = "Phone number not valid"
    }
}

module.exports = PhoneNotValid
