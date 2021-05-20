const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('follow', {

        share_holder_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        sector_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        tableName:"follows"
    });
}