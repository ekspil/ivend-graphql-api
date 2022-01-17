const Sequelize = require("sequelize")

// id
// kktModel
// kktFactoryNumber
// kktRegNumber
// kktFNNumber
// kktActivationDate
// kktBillsCount
// kktOFDRegKey
// kktKassir - пока не надо
// kktKassirPass  - пока не надо
// kktBills  - пока не надо

const Kkt = {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    kktModel: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    inn: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    action: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    rekassaPassword: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false,
        field: "rekassa_password"
    },
    rekassaNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false,
        field: "rekassa_number"
    },
    rekassaKktId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false,
        field: "rekassa_kkt_id"
    },
    server: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    companyName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    kktFactoryNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    kktFNNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    kktActivationDate: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    kktBillsCount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        unique: false
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        unique: false
    },
    kktOFDRegKey: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    kktRegNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    kktLastBill: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: false
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
module.exports = Kkt
