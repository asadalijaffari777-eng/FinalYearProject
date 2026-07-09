const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../../.env') });

const mongoose = require("mongoose");
const Item = require("../models/itemSchema");

const items = [
  // caps
  { name: "Golf Cap", category: "caps", image: "/images/golf-cap.png" },
  { name: "Basketball Cap", category: "caps", image: "/images/basketball-cap.png" },
  { name: "Ascot Cap", category: "caps", image: "/images/ascot-cap.png" },
  { name: "Winter Hat", category: "caps", image: "/images/winter-hat.png" },
  // upper-summer
  { name: "T-Shirt", category: "upper-summer", image: "/images/t-shirt.png" },
  { name: "School Shirt", category: "upper-summer", image: "/images/school-shirt.png" },
  { name: "Polo Shirt", category: "upper-summer", image: "/images/polo-shirt.png" },
  { name: "Sports Shirt", category: "upper-summer", image: "/images/sports-shirt.png" },
  // upper-winter
  { name: "Jackets", category: "upper-winter", image: "/images/jacket.png" },
  { name: "Hoodies", category: "upper-winter", image: "/images/hoodies.png" },
  // lower
  { name: "Trousers", category: "lower", image: "/images/trousers.png" },
  { name: "Jeans Pants", category: "lower", image: "/images/jeans-pants.png" }
];

const seedItems = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("DB connected");

    const existing = await Item.countDocuments();
    if (existing > 0) {
      await Item.deleteMany();
      console.log("Existing items cleared");
    }

    for (const itemData of items) {
      await Item.create(itemData);
    }
    console.log("Items seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed items failed:", err);
    process.exit(1);
  }
};

seedItems();
