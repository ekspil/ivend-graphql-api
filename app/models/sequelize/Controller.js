const Sequelize = require("sequelize")

const Controller = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    uid: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    mode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    accessKey: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    }
}

module.exports = Controller
