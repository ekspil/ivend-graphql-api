const NotAuthorized = require("../errors/NotAuthorized")
const Permission = require("../enum/Permission")
const LegalInfo = require("../models/LegalInfo")

class LegalInfoService {

    constructor({UserModel, LegalInfoModel}) {
        this.User = UserModel
        this.LegalInfo = LegalInfoModel

        this.createLegalInfo = this.createLegalInfo.bind(this)
        this.updateLegalInfo = this.updateLegalInfo.bind(this)
    }


    async createLegalInfo(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_LEGAL_INFO)) {
            throw new NotAuthorized()
        }

        const {
            companyName, city, actualAddress, inn, ogrn, legalAddress, director,
            directorPhone, directorEmail, contactPerson, contactPhone, contactEmail
        } = input

        const legalInfo = new LegalInfo()
        legalInfo.companyName = companyName
        legalInfo.city = city
        legalInfo.actualAddress = actualAddress
        legalInfo.inn = inn
        legalInfo.ogrn = ogrn
        legalInfo.legalAddress = legalAddress
        legalInfo.director = director
        legalInfo.directorPhone = directorPhone
        legalInfo.directorEmail = directorEmail
        legalInfo.contactPerson = contactPerson
        legalInfo.contactPhone = contactPhone
        legalInfo.contactEmail = contactEmail

        return await this.LegalInfo.create(legalInfo)
    }


    async updateLegalInfo(input, user) {
        if (!user || !user.checkPermission(Permission.UPDATE_LEGAL_INFO)) {
            throw new NotAuthorized()
        }

        const legalInfo = await user.getLegalInfo()

        if (!legalInfo) {
            const legalInfo = await this.createLegalInfo(input, user)

            user.legal_info_id = legalInfo.id
            await user.save()

            return legalInfo
        }

        const {
            companyName, city, actualAddress, inn, ogrn, legalAddress, director,
            directorPhone, directorEmail, contactPerson, contactPhone, contactEmail
        } = input

        legalInfo.companyName = companyName
        legalInfo.city = city
        legalInfo.actualAddress = actualAddress
        legalInfo.inn = inn
        legalInfo.ogrn = ogrn
        legalInfo.legalAddress = legalAddress
        legalInfo.director = director
        legalInfo.directorPhone = directorPhone
        legalInfo.directorEmail = directorEmail
        legalInfo.contactPerson = contactPerson
        legalInfo.contactPhone = contactPhone
        legalInfo.contactEmail = contactEmail

        return await legalInfo.save()
    }

}

module.exports = LegalInfoService
