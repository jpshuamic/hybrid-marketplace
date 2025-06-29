const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ✅ Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const models = {};

// ✅ Dynamically import only valid .js model files (skip index.js)
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const modelFactory = require(modelPath);

    // 🔒 Check if it's a function before calling it
    if (typeof modelFactory === 'function') {
      const model = modelFactory(sequelize, DataTypes);
      models[model.name] = model;
      console.log(`✅ ${model.name} model loaded`);
    } else {
      console.warn(`⚠️ Skipped invalid model file: ${file}`);
    }
  });

// ✅ Setup associations
const { User, Listing, Wishlist } = models;

if (User && Listing) {
  User.hasMany(Listing, { foreignKey: 'userId' });
  Listing.belongsTo(User, { foreignKey: 'userId' });
}

if (User && Wishlist && Listing) {
  User.hasMany(Wishlist, { foreignKey: 'userId' });
  Wishlist.belongsTo(User, { foreignKey: 'userId' });

  Wishlist.belongsTo(Listing, { foreignKey: 'listingId' });
}

// ✅ Export models and sequelize instance
module.exports = {
  ...models,
  sequelize
};

const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);
