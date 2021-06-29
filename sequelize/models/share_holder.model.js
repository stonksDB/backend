const { DataTypes } = require('sequelize');

// share_holder_model
module.exports = (sequelize) => {

    sequelize.define('share_holder', {

        share_holder_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(254),
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dob : {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName:"share_holders"
    })
}