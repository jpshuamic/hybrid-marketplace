// models/Wishlist.js
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {
    userId: DataTypes.INTEGER,
    listingId: DataTypes.INTEGER,
  });
  return Wishlist;
};