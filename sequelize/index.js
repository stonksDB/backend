const { applyExtraSetup } = require('./extra-setup');

// for the connection with the postgres db
const sequelize = require('../db/postgres');

// defines the models to be matched
const modelDefiners = [
	require('./models/stock.model'),
	require('./models/history.model'),
	require('./models/news.model'),
	require('./models/share_holder.model'),
	require('./models/follow.model'),
	require('./models/like.model'),
	require('./models/company.model')
	//require('./models/company.model')
];

// define model and attach to sequelize
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;