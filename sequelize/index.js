const { applyExtraSetup } = require('./extra-setup');

const sequelize = require('../db/postgres').sequelize;

const modelDefiners = [
	require('./models/stock.model'),
	require('./models/history.model'),
	require('./models/news.model'),
	//require('./models/company.model')
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;