const Sequelize = require("sequelize")
const PI = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    partnerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "partner_id"
    },
    fileLogo: {
        type: Sequelize.DataTypes.TEXT,
        unique: false,
        field: "file_logo"
    },
    fileOferta: {
        type: Sequelize.DataTypes.TEXT,
        unique: false,
        field: "file_oferta"
    },
    infoPhoneTech: {
        type: Sequelize.DataTypes.TEXT,
        unique: false,
        field: "info_phone_tech"
    },
    infoPhoneCom: {
        type: Sequelize.DataTypes.TEXT,
        unique: false,
        field: "info_phone_com"
    },
    infoRequisites: {
        type: Sequelize.DataTypes.TEXT,
        unique: false,
        field: "info_requisites"
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "updated_at"
    }
}
module.exports = PI
