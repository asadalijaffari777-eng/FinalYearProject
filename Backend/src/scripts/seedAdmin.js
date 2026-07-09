const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../../.env') });

const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("DB connected");

    const adminEmail = "admin@startupgenius.com";
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log("Admin already exists. Skipping.");
      await mongoose.connection.close();
      process.exit(0);
    }

    await User.create({
      username: "Admin",
      email: adminEmail,
      password: "Admin@123",
      role: "admin",
      isVerified: true,
      authProvider: "local"
    });

    console.log("Admin created successfully");
    console.log("Email: admin@startupgenius.com");
    console.log("Password: Admin@123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed admin failed:", err);
    process.exit(1);
  }
};

seedAdmin();
