
function NewsResolver({userService}) {


    const smsStatus = async (obj, args, context) => {
        const {user} = context
        return await userService.smsingJobStatus(obj.id, user)
    }

    const mailStatus = async (obj, args, context) => {
        const {user} = context
        return await userService.mailingJobStatus(obj.id, user)
    }


    return {
        smsStatus,
        mailStatus

    }

}

module.exports = NewsResolver

