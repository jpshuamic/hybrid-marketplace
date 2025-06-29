'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Listings', 'imageUrls', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    });
    await queryInterface.removeColumn('Listings', 'imageUrl');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Listings', 'imageUrl', {
      type: Sequelize.STRING
    });
    await queryInterface.removeColumn('Listings', 'imageUrls');
  }
};