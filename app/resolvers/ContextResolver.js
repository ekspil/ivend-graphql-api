const bcryptjs = require("bcryptjs")

const RolePermissions = require("../enum/RolePermissions")

const parseAuthorizationHeader = async (header) => {
    const splitted = header.split(" ")
    const method = splitted[0]
    const value = splitted[1]

    if (method === 'Basic') {
        const credentials = Buffer.from(value, 'base64')
            .toString('ascii')
            .split(":")

        const username = credentials[0]
        const password = credentials[1]

        return {
            type: 'basic',
            username,
            password
        }
    }

    throw new Error("Unknown authenticate type")
}


module.exports = function (userRepository) {

    const authBasic = async (authCreds) => {
        const {username, password} = authCreds

        const user = await userRepository.findOne({email: username})

        if (user) {

            const equals = await bcryptjs.compare(password, user.passwordHash)

            if (equals) {

                user.checkPermission = (permission) => {
                    const role = user.role.name
                    return RolePermissions[role] && RolePermissions[role].indexOf(permission) !== -1;
                }

                return {user: user}
            }
        }
    }

    return async ({req}) => {
        const authorizationHeader = req.headers.authorization

        if (authorizationHeader) {
            try {
                const authCreds = await parseAuthorizationHeader(authorizationHeader)

                const {type} = authCreds

                switch (type) {
                    case "basic":
                        return await authBasic(authCreds)
                }

            } catch (e) {

            }
        }
    }

}

