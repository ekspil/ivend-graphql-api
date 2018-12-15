const bcryptjs = require("bcryptjs")

const parseAuthorizationHeader = async (header) => {
    const splitted = header.split(" ")
    const method = splitted[0]
    const value = splitted[1]

    if (method === 'basic') {
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


const resolveAuth = async (ctx) => {

}

module.exports = function (userRepository) {
    return async ({req}) => {
        const authorizationHeader = req.headers.authorization

        if (authorizationHeader) {
            try {
                const authCreds = await parseAuthorizationHeader(authorizationHeader)

                const {type} = authCreds

                if (type === 'basic') {
                    const {username, password} = authCreds

                    const user = await userRepository.findOne({email: username})

                    if (user) {

                        const equals = await bcryptjs.compare(password, user.passwordHash)

                        if (equals) {
                            return {user}
                        }

                    }
                }

            } catch (e) {

            }
        }
    }

}

