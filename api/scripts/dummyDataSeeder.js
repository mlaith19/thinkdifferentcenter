const { sequelize } = require("../assets/SQLDB/db");
const User = require("../models/User");
const Course = require("../models/Course");
const Session = require("../models/Session");
const Attendance = require("../models/Attendance");
const ParticipatingStudents = require("../models/ParticipatingStudents");
const bcrypt = require("bcryptjs");
const { faker } = require('@faker-js/faker');
const { addDays, addWeeks, format, parseISO } = require('date-fns');

// Helper function to generate a random date between two dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate a random time between 8 AM and 4 PM
const randomTime = () => {
  const hours = Math.floor(Math.random() * 8) + 8; // 8 AM to 4 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

const seedDummyData = async () => {
  let transaction;
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Start a transaction
    transaction = await sequelize.transaction();

    // Create a teacher
    const teacherPassword = await bcrypt.hash("teacher123", 10);
    const teacherFirstName = faker.person.firstName();
    const teacherLastName = faker.person.lastName();
    const teacher = await User.create({
      username: faker.internet.userName({ firstName: teacherFirstName, lastName: teacherLastName }),
      firstName: teacherFirstName,
      lastName: teacherLastName,
      fullName: `${teacherFirstName} ${teacherLastName}`,
      email: faker.internet.email({ firstName: teacherFirstName, lastName: teacherLastName }),
      password: teacherPassword,
      role: "teacher",
      instituteId: 1,
      branchId: 1,
      isActive: true,
      points: faker.number.int({ min: 0, max: 1000 }),
      rewards: Array(faker.number.int({ min: 0, max: 5 })).fill().map(() => ({
        name: faker.commerce.productName(),
        points: faker.number.int({ min: 10, max: 100 }),
        date: faker.date.past()
      })),
      birthDate: faker.date.birthdate({ min: 25, max: 60, mode: 'age' }),
      phone: faker.phone.number()
    }, { transaction });
    console.log("Teacher created successfully");

    // Create students
    const students = await Promise.all(
      Array(5).fill().map(async (_, index) => {
        const password = await bcrypt.hash("student123", 10);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return User.create({
          username: faker.internet.userName({ firstName, lastName }),
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }),
          password,
          role: "student",
          instituteId: 1,
          branchId: 1,
          isActive: true,
          points: faker.number.int({ min: 0, max: 500 }),
          rewards: Array(faker.number.int({ min: 0, max: 3 })).fill().map(() => ({
            name: faker.commerce.productName(),
            points: faker.number.int({ min: 10, max: 50 }),
            date: faker.date.past()
          })),
          birthDate: faker.date.birthdate({ min: 10, max: 20, mode: 'age' }),
          phone: faker.phone.number()
        }, { transaction });
      })
    );
    console.log("Students created successfully");

    // Create multiple courses
    const courses = await Promise.all(
      Array(3).fill().map(async () => {
        const courseName = faker.helpers.arrayElement([
          "Mathematics",
          "Science",
          "English",
          "History",
          "Computer Science",
          "Art",
          "Music",
          "Physical Education"
        ]);
        return Course.create({
          name: courseName,
          description: faker.lorem.paragraph(),
          paymentType: faker.helpers.arrayElement(["free", "per_session", "full_course"]),
          price: faker.number.int({ min: 0, max: 1000 }),
          registrationStartDate: faker.date.past(),
          registrationEndDate: faker.date.future(),
          teacherId: teacher.id,
          teacherName: `${teacher.firstName} ${teacher.lastName}`,
          instituteId: 1,
          branchId: 1,
          numberOfSessions: faker.number.int({ min: 10, max: 30 }),
          status: "active",
          scheduleDays: faker.helpers.arrayElements(
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            { min: 2, max: 4 }
          ),
          autoGenerateSchedule: true
        }, { transaction });
      })
    );
    console.log("Courses created successfully");

    // Enroll students in courses
    await Promise.all(
      courses.flatMap(course =>
        students.map(student =>
          ParticipatingStudents.create({
            courseId: course.id,
            studentId: student.id,
            status: faker.helpers.arrayElement(["active", "inactive", "completed"]),
            enrollmentDate: faker.date.past()
          }, { transaction })
        )
      )
    );
    console.log("Students enrolled in courses successfully");

    // Create sessions for each course
    const sessions = await Promise.all(
      courses.flatMap(course =>
        Array(faker.number.int({ min: 5, max: 10 })).fill().map((_, index) => {
          const date = addWeeks(new Date(), index);
          return Session.create({
            date,
            startTime: randomTime(),
            endTime: randomTime(),
            courseId: course.id,
            teacherId: teacher.id,
            status: faker.helpers.arrayElement(["scheduled", "completed", "cancelled"])
          }, { transaction });
        })
      )
    );
    console.log("Sessions created successfully");

    // Create attendance records for each session
    await Promise.all(
      sessions.map(session =>
        Promise.all(
          students.map(student =>
            Attendance.create({
              studentId: student.id,
              sessionId: session.id,
              status: faker.helpers.arrayElement(["present", "absent", "late", "excused"]),
              notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
              markedBy: teacher.id,
              markedAt: faker.date.recent()
            }, { transaction })
          )
        )
      )
    );
    console.log("Attendance records created successfully");

    // Commit the transaction
    await transaction.commit();

    console.log("\n=== Dummy Data Seeded Successfully! ===");
    console.log("\nTeacher credentials:");
    console.log(`Username: ${teacher.username}`);
    console.log(`Email: ${teacher.email}`);
    console.log("Password: teacher123");
    console.log("\nStudent credentials:");
    students.forEach((student, index) => {
      console.log(`Student ${index + 1}:`);
      console.log(`Username: ${student.username}`);
      console.log(`Email: ${student.email}`);
      console.log("Password: student123");
    });

    return true;
  } catch (error) {
    // Rollback the transaction if there's an error
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error seeding dummy data:", error);
    throw error;
  }
};

// Export the function for use in routes
module.exports = { seedDummyData };

// Only run directly if this file is being executed directly
if (require.main === module) {
  seedDummyData()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
} 