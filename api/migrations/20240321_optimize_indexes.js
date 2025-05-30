'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove unnecessary indexes
    await queryInterface.removeIndex('Institutes', 'email');
    await queryInterface.removeIndex('Users', 'email');
    await queryInterface.removeIndex('Users', 'username');

    // Add optimized indexes
    await queryInterface.addIndex('Institutes', ['email'], {
      unique: true,
      name: 'institutes_email_unique'
    });

    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });

    await queryInterface.addIndex('Users', ['username'], {
      unique: true,
      name: 'users_username_unique'
    });

    // Add composite indexes for frequently queried fields
    await queryInterface.addIndex('Courses', ['instituteId', 'status'], {
      name: 'courses_institute_status'
    });

    await queryInterface.addIndex('Sessions', ['courseId', 'date'], {
      name: 'sessions_course_date'
    });

    await queryInterface.addIndex('Users', ['instituteId', 'role'], {
      name: 'users_institute_role'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove optimized indexes
    await queryInterface.removeIndex('Institutes', 'institutes_email_unique');
    await queryInterface.removeIndex('Users', 'users_email_unique');
    await queryInterface.removeIndex('Users', 'users_username_unique');
    await queryInterface.removeIndex('Courses', 'courses_institute_status');
    await queryInterface.removeIndex('Sessions', 'sessions_course_date');
    await queryInterface.removeIndex('Users', 'users_institute_role');

    // Restore original indexes
    await queryInterface.addIndex('Institutes', ['email'], {
      unique: true
    });
    await queryInterface.addIndex('Users', ['email'], {
      unique: true
    });
    await queryInterface.addIndex('Users', ['username'], {
      unique: true
    });
  }
}; 