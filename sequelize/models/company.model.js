const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('company', {

        ticker: {
            type: DataTypes.STRING(8),
            allowNull: false,
            primaryKey: true
        },
        company_name: {
            type: DataTypes.STRING(80)
        },
        market_cap: {
            type: DataTypes.INTEGER
        },
        logo_url: {
            type: DataTypes.STRING(200)
        },
        full_time_employees: {
            type: DataTypes.INTEGER
        },
        city: {
            type: DataTypes.STRING(50)
        },
        industry_id: {
            type: DataTypes.INTEGER
        },
        website: {
            type: DataTypes.STRING(200)
        },
        phone: {
            type: DataTypes.STRING(25)
        }
    }, {
        tableName: 'companies'
    })
}