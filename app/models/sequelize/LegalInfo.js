const Sequelize = require("sequelize")

const LegalInfo = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "company_name"
    },
    city: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "city"
    },
    actualAddress: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "actual_address"
    },
    inn: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "inn"
    },
    sno: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "sno"
    },
    ogrn: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "ogrn"
    },
    legalAddress: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "legal_address"
    },
    director: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "director"
    },
    directorPhone: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "director_phone"
    },
    directorEmail: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "director_email"
    },
    contactPerson: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "contact_person"
    },
    contactPhone: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "contact_phone"
    },
    contactEmail: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: "contact_email"
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

module.exports = LegalInfo
