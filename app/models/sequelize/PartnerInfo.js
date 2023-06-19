const Sequelize = require("sequelize")

const PartnerInfo = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    active: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
    },
    link: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
    header: {
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
module.exports = PartnerInfo
