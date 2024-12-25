const { testDatabaseConnection } = require("./assets/SQLDB/db");  // Ensure this import is correct

testDatabaseConnection();  // Test the database connection
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const dotenv = require("dotenv");
const { sequelize } = require("./assets/SQLDB/db");

const userRoutes = require("./routes/userRoutes");
sequelize.authenticate()
.then(() => {
  console.log("Connection to MySQL has been established successfully.");
})
.catch((err) => {
  console.log("Unable to connect to MySQL:", err);
});
sequelize.sync({ force: true }).then(() => {
    console.log("Database tables have been synced.");
  }).catch(err => {
    console.log("Error syncing database:", err);
  });
  
dotenv.config();

const app = express();

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
 

// Start the server
const PORT = process.env.DEV_API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
