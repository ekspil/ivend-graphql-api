const Sequelize = require("sequelize")


const User = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    step: {
        type: Sequelize.DataTypes.INTEGER
    },
    partnerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "partner_id"
    },
    managerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "manager_id"
    },
    partner: {
        type: Sequelize.DataTypes.TEXT
    },
    autoSend: {
        type: Sequelize.DataTypes.BOOLEAN,
        field: "auto_send"
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    countryCode: {
        type: Sequelize.DataTypes.STRING,
        field: "country_code"
    },
    passwordHash: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    companyName: {
        type: Sequelize.DataTypes.TEXT,
        field: "company_name"
    },
    inn: {
        type: Sequelize.DataTypes.TEXT
    },
    role: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
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
module.exports = User
