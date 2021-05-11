const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('news', {

        news_id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        publish_date: {
            type: DataTypes.DATE,
            allowNull: false,            
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        author: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true
        },        
        link: {
            type: DataTypes.STRING(2000),
            allowNull: true
        }
    }, {
        tableName:"news"
    })
}