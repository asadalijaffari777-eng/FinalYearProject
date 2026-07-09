const Item = require('../models/itemSchema');

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
