'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enrollments', {
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
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'dropped'),
        defaultValue: 'active',
        allowNull: false,
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      attendanceRate: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      enrollmentDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      completionDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.addIndex('Enrollments', ['studentId']);
    await queryInterface.addIndex('Enrollments', ['courseId']);
    await queryInterface.addIndex('Enrollments', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Enrollments');
  }
}; 