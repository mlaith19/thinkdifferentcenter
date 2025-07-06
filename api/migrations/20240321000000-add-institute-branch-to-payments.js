'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Payments', 'instituteId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Institutes',
        key: 'id'
      },
      after: 'id'
    });

    // Check if branchId exists
    const tableInfo = await queryInterface.describeTable('Payments');
    if (!tableInfo.branchId) {
      await queryInterface.addColumn('Payments', 'branchId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Branches',
          key: 'id'
        },
        after: 'instituteId'
      });
    }

    // Check if recordedBy exists
    if (!tableInfo.recordedBy) {
      await queryInterface.addColumn('Payments', 'recordedBy', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        after: 'paymentPlanId'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Payments', 'instituteId');
    await queryInterface.removeColumn('Payments', 'branchId');
    await queryInterface.removeColumn('Payments', 'recordedBy');
  }
}; 