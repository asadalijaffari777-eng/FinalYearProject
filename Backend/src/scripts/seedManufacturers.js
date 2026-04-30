require("dotenv").config({ path: '../../.env' });

const mongoose = require("mongoose");
const Manufacturer = require("../models/manufacturerSchema");
const manufacturersData = require("../data/manufacturersData");

const seedDB = async () => {
  try {
    console.log("Connecting to DB...");

    await mongoose.connect(process.env.DATABASE_URL);

    console.log("DB connected");

    // OPTIONAL: prevent accidental deletion
    const shouldReset = process.argv.includes("--reset");

    if (shouldReset) {
      await Manufacturer.deleteMany();
      console.log("Existing manufacturers cleared");
    }

    // Check if data already exists (prevents duplicates)
    const existingCount = await Manufacturer.countDocuments();

    if (existingCount > 0 && !shouldReset) {
      console.log("Data already exists. Skipping seed.");
      return process.exit(0);
    }

    // Insert data
    await Manufacturer.insertMany(manufacturersData);

    console.log("Manufacturers seeded successfully");

    await mongoose.connection.close();
    console.log("DB connection closed");

    process.exit(0);

  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seedDB();