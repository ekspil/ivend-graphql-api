const NotAuthorized = require("../errors/NotAuthorized")
const Revision = require("../models/Revision")
const Permission = require("../enum/Permission")

class RevisionService {

    constructor({RevisionModel}) {
        this.Revision = RevisionModel

        this.createRevision = this.createRevision.bind(this)
        this.getAll = this.getAll.bind(this)
        this.getRevisionById = this.getRevisionById.bind(this)
    }

    async createRevision(input, user) {
        if (!user || !user.checkPermission(Permission.CREATE_REVISION)) {
            throw new NotAuthorized()
        }

        const {name} = input

        const revision = new Revision()
        revision.name = name

        return this.Revision.create(revision)
    }

    async getAll(user) {
        if (!user || !user.checkPermission(Permission.GET_ALL_REVISIONS)) {
            throw new NotAuthorized()
        }

        return this.Revision.findAll()
    }


    async getRevisionById(id, user) {
        if (!user || !user.checkPermission(Permission.GET_REVISION_BY_ID)) {
            throw new NotAuthorized()
        }

        return this.Revision.findOne({where: {id}})
    }

}

module.exports = RevisionService
