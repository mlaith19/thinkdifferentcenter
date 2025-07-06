'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Expenses');
    if (!tableInfo.instituteId) {
      await queryInterface.addColumn('Expenses', 'instituteId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Institutes',
          key: 'id',
        },
        after: 'id',
      });
    }
    if (!tableInfo.branchId) {
      await queryInterface.addColumn('Expenses', 'branchId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Branches',
          key: 'id',
        },
        after: 'instituteId',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Expenses', 'instituteId');
    await queryInterface.removeColumn('Expenses', 'branchId');
  },
}; 