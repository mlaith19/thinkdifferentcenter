const bcrypt = require('bcrypt');
const { sequelize } = require('../assets/SQLDB/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Session = require('../models/Session');
const Branch = require('../models/Branch');
const Institute = require('../models/Institute');

const seedDummyData = async () => {
  try {
    // Create a dummy institute first
    const institute = await Institute.create({
      name: 'Test Institute',
      email: 'test@institute.com',
      password: await bcrypt.hash('institute123', 10),
      licenseKey: 'TEST-LICENSE-KEY-123',
      status: 'active'
    });

    // Create a dummy branch
    const branch = await Branch.create({
      name: 'Main Branch',
      address: '123 Main St',
      phone: '1234567890',
      instituteId: institute.id
    });

    // Create a dummy teacher
    const teacher = await User.create({
      fullName: 'John Doe',
      email: 'teacher@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '1234567890',
      role: 'teacher',
      instituteId: institute.id,
      branchId: branch.id
    });

    // Create a dummy course
    const course = await Course.create({
      name: 'Mathematics 101',
      description: 'Basic mathematics course',
      paymentType: 'full_course',
      price: 100,
      registrationStartDate: new Date(),
      registrationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      minAge: 10,
      maxAge: 15,
      numberOfSessions: 12,
      scheduleDays: JSON.stringify(['monday', 'wednesday']),
      autoGenerateSchedule: true,
      status: 'active',
      instituteId: institute.id,
      branchId: branch.id,
      teacherId: teacher.id,
      teacherName: teacher.fullName
    });

    // Create dummy sessions
    const sessions = [];
    const startDate = new Date();
    for (let i = 0; i < 12; i++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(startDate.getDate() + (i * 2)); // Every other day
      
      sessions.push({
        date: sessionDate,
        startTime: '09:00:00',
        endTime: '10:30:00',
        status: 'scheduled',
        courseId: course.id,
        teacherId: teacher.id
      });
    }

    await Session.bulkCreate(sessions);

    console.log('Dummy data seeded successfully');
  } catch (error) {
    console.error('Error seeding dummy data:', error);
    throw error;
  }
};

module.exports = seedDummyData; 