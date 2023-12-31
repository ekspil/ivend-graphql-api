const Sequelize = require("sequelize")

const ControllerPulse = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    controllerId: {
        type: Sequelize.DataTypes.INTEGER,
        field: "controller_id",
    },
    a: {
        type: Sequelize.DataTypes.INTEGER
    },
    b: {
        type: Sequelize.DataTypes.INTEGER
    },
    c: {
        type: Sequelize.DataTypes.INTEGER
    },
    o: {
        type: Sequelize.DataTypes.INTEGER
    },
    t: {
        type: Sequelize.DataTypes.INTEGER
    },
    d: {
        type: Sequelize.DataTypes.INTEGER
    },
    e: {
        type: Sequelize.DataTypes.INTEGER
    },
    f: {
        type: Sequelize.DataTypes.INTEGER
    },
    randomCommands: {
        type: Sequelize.DataTypes.STRING,
        field: "random_commands"
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "updated_at"
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        unique: false,
        field: "created_at"
    }
}
module.exports = ControllerPulse
