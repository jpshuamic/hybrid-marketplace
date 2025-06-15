const express = require('express');
const { sequelize, connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// Sync DB
sequelize.sync().then(() => {
  console.log('📦 DB Synced');
}).catch(err => {
  console.error('DB Sync Error:', err);
});

// Start Server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server is listening on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });
