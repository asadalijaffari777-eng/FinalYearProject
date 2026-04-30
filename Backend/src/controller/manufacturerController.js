const Manufacturer = require("../models/manufacturerSchema");

exports.getManufacturers = async (req, res) => {
  try {
    const { items } = req.query;

    if (!items) {
      return res.status(400).json({ message: "Items are required" });
    }

    // convert "t-shirt,polo-shirt" → ["t-shirt", "polo-shirt"]
    const itemsArray = items.split(",");

    const manufacturers = await Manufacturer.find({
      categories: { $in: itemsArray }
    });

    console.log("Found:", manufacturers);

    if (manufacturers.length === 0) {
      return res.status(404).json({ message: "No manufacturer found" });
    }

    res.json(manufacturers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};