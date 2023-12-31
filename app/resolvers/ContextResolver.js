const bcryptjs = require("bcryptjs")

const RolePermissions = require("../enum/RolePermissions")
const UnknownAuthenticationType = require("../errors/UnknownAuthenticationType")
const logger = require("my-custom-logger")

const parseAuthorizationHeader = async (header) => {
    const splitted = header.split(" ")
    const method = splitted[0]
    const value = splitted[1]

    if (method === "Basic") {
        const [username, password] =
            Buffer
                .from(value, "base64")
                .toString("ascii")
                .split(":")

        return {
            type: "basic",
            username,
            password
        }
    }

    if (method === "Bearer") {
        return {
            type: "bearer",
            token: value,
        }
    }

    throw new UnknownAuthenticationType()
}


module.exports = function ({UserModel, redis}) {

    const populateUserInContext = async (user) => {
        user.checkPermission = (permission) => {
            const role = user.role

            if (role === "ADMIN") {
                return true
            }

            return RolePermissions[role] && RolePermissions[role].indexOf(permission) !== -1
        }

        return {user: user}
    }

    const authBasic = async (authCreds) => {
        const {username, password} = authCreds

        const user = await UserModel.findOne({
            where: {
                phone: username
            }
        })

        if (user) {

            const equals = await bcryptjs.compare(password, user.passwordHash)

            if (equals) {
                return populateUserInContext(user)
            }
        }
    }

    const authBearer = async (authCreds) => {
        const {token} = authCreds

        const userId = await redis.hget("tokens", token)
        const existToken = await redis.hget("tokens", `user_${userId}`)
        if(!existToken) {
            redis.hdel("tokens", token)
            return
        }

        if (userId) {
            const user = await UserModel.findOne({
                where: {
                    id: Number(userId)
                }
            })

            if (user) {

                return populateUserInContext(user)
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
                    case "bearer":
                        return await authBearer(authCreds)
                }

            } catch (e) {
                logger.error(e)
            }
        }
    }

}

