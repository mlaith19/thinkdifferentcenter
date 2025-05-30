const express = require("express");
const router = express.Router();
const { seedDummyData } = require("../scripts/dummyDataSeeder");

// Route to seed dummy data (only available in development)
router.post("/seed-dummy-data", async (req, res) => {
  try {
    const result = await seedDummyData();
    res.json({
      success: true,
      message: "Dummy data seeded successfully",
      data: {
        teacher: {
          email: "teacher@example.com",
          password: "teacher123"
        },
        students: Array(5).fill().map((_, i) => ({
          email: `student${i + 1}@example.com`,
          password: "student123"
        }))
      }
    });
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    res.status(500).json({
      success: false,
      message: "Error seeding dummy data",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

module.exports = router; 