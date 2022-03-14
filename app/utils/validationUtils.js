function validatePhoneNumber(phone) {
    return typeof phone === "string" && new RegExp(/^[7,9](\d){8,9}$/).test(phone)
}


module.exports = {
    validatePhoneNumber
}
