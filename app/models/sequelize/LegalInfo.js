const Sequelize = require("sequelize")

const LegalInfo = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "company_name"
    },
    city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "city"
    },
    actualAddress: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "actual_address"
    },
    inn: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "inn"
    },
    ogrn: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "company_name"
    },
    legalAddress: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "legal_address"
    },
    director: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "director"
    },
    directorPhone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "director_phone"
    },
    directorEmail: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "director_email"
    },
    contactPerson: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "contact_person"
    },
    contactPhone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "contact_phone"
    },
    contactEmail: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "contact_email"
    }
}

module.exports = LegalInfo
