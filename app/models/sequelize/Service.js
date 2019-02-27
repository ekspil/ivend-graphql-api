const Sequelize = require("sequelize")

const Service = {
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
    price: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
    },
    // DAILY, MONTHY, etc...
    billingType: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        field: "billing_type"
    },
    // applied to what? CONTROLLER, USER, etc ...
    type: {
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

module.exports = Service
