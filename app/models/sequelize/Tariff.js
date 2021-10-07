const Sequelize = require("sequelize")

const Tariff = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    telemetry: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    acquiring: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    fiscal: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    meta: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    partnerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "partner_id"
    },
    startedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "started_at"
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

module.exports = Tariff
