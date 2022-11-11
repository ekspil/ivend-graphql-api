function validatePhoneNumber(phone) {
    return typeof phone === "string" && new RegExp(/^[7,9](\d){7,9}$/).test(phone)
}


module.exports = {
    validatePhoneNumber
}
