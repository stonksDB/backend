const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('sector', {
        sector_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sector_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName:"sectors"
    });
}