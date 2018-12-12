
class Controller {
    constructor(rawObj) {
        const {uid, mode, accessKey} = rawObj

        this.uid = uid
        this.mode = mode
        this.accessKey = accessKey
    }

}


module.exports = Controller