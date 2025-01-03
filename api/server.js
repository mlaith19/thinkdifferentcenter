const { sequelize } = require("./assets/SQLDB/db");
const User = require("./models/User");
const bcrypt = require("bcrypt");
 
// Sync database tables
sequelize.sync({   }) // force: true علشان يعمل drop للجداول ويعيد إنشائها
  .then(() => {
    console.log("Database tables have been synced.");
  })
  .catch(err => {
    console.log("Error syncing database:", err);
  });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
 
 
const instituteRoutes = require("./routes/instituteRoutes");

dotenv.config();

const app = express();

const createSuperAdmin = async () => {
  try {
    const superAdminEmail = "super@admin.com";
    const existingAdmin = await User.findOne({ where: { email: superAdminEmail } });

    if (existingAdmin) {
      console.log("Super admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123456", 10);

    await User.create({
      username: "super admin",
      email: superAdminEmail,
      password: hashedPassword,
      fullName: "Super Admin",
      userType: "super_admin",
    });

    console.log("Super admin account created successfully.");
  } catch (error) {
    console.error("Error creating super admin account:", error);
  }
};

// Call the function when the server starts
createSuperAdmin();
// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// CORS setup
const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting middleware (optional)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
 
 

app.use("/api/institute", instituteRoutes);

// Start the server
const PORT = process.env.DEV_API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});