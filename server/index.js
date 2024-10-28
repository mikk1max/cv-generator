require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes); // Use endpoints defined in authRoutes under /api/auth path
app.use("/api/users", userRoutes); // Use endpoints defined in userRoutes under /api/users path

const port = process.env.PORT || 8080;

const connection = require('./db');
connection();

app.listen(port, () => console.log(`Listening on port ${port}`));