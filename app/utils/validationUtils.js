function validatePhoneNumber(phone) {
    return typeof phone === "string" && new RegExp(/^9(\d){9,9}$/).test(phone)
}


module.exports = {
    validatePhoneNumber
}
