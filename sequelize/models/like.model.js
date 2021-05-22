const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('like', {

        share_holder_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        ticker: {
            type: DataTypes.STRING(8),
            allowNull: false,
            primaryKey: true
        }
    }, {
        tableName:"likes"
    });
}