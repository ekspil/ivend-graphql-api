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
            directorPhone, directorEmail, contactPerson, contactPhone, contactEmail, sno
        } = input

        return await this.LegalInfo.sequelize.transaction(async (transaction) => {
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
            legalInfo.sno = sno

            //todo ensure not legal info already created for this user
            user.role = "VENDOR"
            user.inn = inn
            user.companyName = companyName

            if(user.step < 1){
                user.step = 1
            }

            await user.save({transaction})

            return await this.LegalInfo.create(legalInfo, {transaction})
        })
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
            directorPhone, directorEmail, contactPerson, contactPhone, contactEmail, sno
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
        legalInfo.sno = sno
        user.inn = inn
        user.companyName = companyName
        await user.save()
        return await legalInfo.save()
    }

    async updateLegalInfoToUser(input, user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_USERS)) {
            throw new NotAuthorized()
        }

        const {
            userId, companyName, city, actualAddress, inn, ogrn, legalAddress, director,
            directorPhone, directorEmail, contactPerson, contactPhone, contactEmail, sno
        } = input

        const selectedUser = await this.User.findOne({
            where: {
                id: userId
            }
        })

        const legalInfo = await this.LegalInfo.findOne({
            where: {
                id: selectedUser.legal_info_id
            }
        })

        selectedUser.inn = inn
        selectedUser.companyName = companyName
        await selectedUser.save()


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
        legalInfo.sno = sno
        return await legalInfo.save()
    }

}

module.exports = LegalInfoService
