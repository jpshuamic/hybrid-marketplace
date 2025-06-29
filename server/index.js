const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Sequelize connection
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

// ✅ Dynamically load all models
const models = {};
fs.readdirSync(path.join(__dirname, 'models'))
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const defineModel = require(path.join(__dirname, 'models', file));
    const model = defineModel(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
    console.log(`✅ ${model.name} model loaded`);
});

// ✅ Setup model associations
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

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
// Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// ✅ Export models globally (optional for route access)
app.set('models', models);
app.set('sequelize', sequelize);

// ✅ Start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});