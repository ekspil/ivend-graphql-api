const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")

class ItemService {

    constructor({UserModel, PartnerSettingsModel}) {
        this.User = UserModel
        this.PartnerSettings = PartnerSettingsModel

        this.changeFee = this.changeFee.bind(this)
    }


    async changeFee(input, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }
        const {userId, controllerFee, kkmFee, terminalFee} = input

        let settings = await this.PartnerSettings.findOne({
            where: {
                userId
            }
        })
        if(!settings){
            settings = await this.PartnerSettings.create({controllerFee: 0, kkmFee: 0, terminalFee: 0, userId})
        }
        settings.controllerFee = controllerFee
        settings.kkmFee = kkmFee
        settings.terminalFee = terminalFee
        await settings.save()
            

        return settings
    }
    async getFee(userId, user) {
        if (!user || !user.checkPermission(Permission.SUPERADMIN)) {
            throw new NotAuthorized()
        }

        let settings = await this.PartnerSettings.findOne({
            where: {
                userId
            }
        })
        if(!settings){
            throw new Error("No partner settings")
        }


        return settings
    }


}

module.exports = ItemService
