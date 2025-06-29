// models/Listing.js

module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    category: DataTypes.STRING,
    location: DataTypes.STRING,
    imageUrls: DataTypes.ARRAY(DataTypes.STRING),

    // 💡 New fields for logistics
    hasDelivery: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deliveryFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  });

  return Listing;
};
