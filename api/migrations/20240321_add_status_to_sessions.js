'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Sessions', 'status', {
      type: Sequelize.ENUM('scheduled', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Sessions', 'status');
  }
}; 