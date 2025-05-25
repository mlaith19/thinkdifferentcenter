'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attendance', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sessions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false,
        defaultValue: 'absent',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      markedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      markedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex('attendance', ['studentId']);
    await queryInterface.addIndex('attendance', ['sessionId']);
    await queryInterface.addIndex('attendance', ['status']);
    await queryInterface.addIndex('attendance', ['markedBy']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendance');
  }
}; 