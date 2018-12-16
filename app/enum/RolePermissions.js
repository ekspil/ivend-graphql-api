const Permission = require("./Permission")

const RolePermissions = {
    "USER": [Permission.READ_CONTROLLER],
    "ADMIN": [Permission.READ_CONTROLLER, Permission.WRITE_CONTROLLER],
    "AGGREGATE": [Permission.WRITE_CONTROLLER],
}


module.exports = RolePermissions
