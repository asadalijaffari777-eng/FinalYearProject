const Manufacturer = require("../models/manufacturerSchema");

exports.getManufacturers = async (req, res) => {
  try {
    const { items, type, priceRange, search } = req.query;

    let filter = {};

    // filter by categories (existing behavior: "t-shirt,polo-shirt")
    if (items) {
      filter.categories = { $in: items.split(",") };
    }

    // filter by manufacturer type
    if (type) {
      filter.type = type;
    }

    // filter by price range
    if (priceRange) {
      filter.priceRange = priceRange;
    }

    // search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const manufacturers = await Manufacturer.find(filter).sort({ name: 1 });

    res.json(manufacturers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};