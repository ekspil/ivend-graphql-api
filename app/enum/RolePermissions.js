const Permission = require("./Permission")

const RolePermissions = {
    "USER": [Permission.READ_CONTROLLER],
    //ADMIN ROLE does not need permissions at all, he have access to all methods
    "ADMIN": [],
    "AGGREGATE": [Permission.WRITE_CONTROLLER, Permission.AUTH_CONTROLLER],
}


module.exports = RolePermissions
