'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get table info
    const tableInfo = await queryInterface.describeTable('Users');
    
    // Add points if it doesn't exist
    if (!tableInfo.points) {
      await queryInterface.addColumn('Users', 'points', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
    }

    // Add rewards if it doesn't exist
    if (!tableInfo.rewards) {
      await queryInterface.addColumn('Users', 'rewards', {
        type: Sequelize.JSON,
        defaultValue: [],
        allowNull: false
      });
    }

    // Add lastLogin if it doesn't exist
    if (!tableInfo.lastLogin) {
      await queryInterface.addColumn('Users', 'lastLogin', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }

    // Add resetPasswordToken if it doesn't exist
    if (!tableInfo.resetPasswordToken) {
      await queryInterface.addColumn('Users', 'resetPasswordToken', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Add resetPasswordExpires if it doesn't exist
    if (!tableInfo.resetPasswordExpires) {
      await queryInterface.addColumn('Users', 'resetPasswordExpires', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Get table info
    const tableInfo = await queryInterface.describeTable('Users');
    
    // Remove columns if they exist
    if (tableInfo.points) {
      await queryInterface.removeColumn('Users', 'points');
    }
    if (tableInfo.rewards) {
      await queryInterface.removeColumn('Users', 'rewards');
    }
    if (tableInfo.lastLogin) {
      await queryInterface.removeColumn('Users', 'lastLogin');
    }
    if (tableInfo.resetPasswordToken) {
      await queryInterface.removeColumn('Users', 'resetPasswordToken');
    }
    if (tableInfo.resetPasswordExpires) {
      await queryInterface.removeColumn('Users', 'resetPasswordExpires');
    }
  }
}; 