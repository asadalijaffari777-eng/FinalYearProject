const User = require('../models/User');
const Manufacturer = require('../models/manufacturerSchema');
const Item = require('../models/itemSchema');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalManufacturers = await Manufacturer.countDocuments();
    const totalItems = await Item.countDocuments();
    res.json({ totalUsers, totalManufacturers, totalItems });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const users = await User.find(query).select('-password -otp -otpExpires -token').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getManufacturers = async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find().sort({ name: 1 });
    res.json(manufacturers);
  } catch (err) {
    console.error('Get manufacturers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createManufacturer = async (req, res) => {
  try {
    const { name, image, categories, location, type, moq, priceRange, links, contact } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    const manufacturer = new Manufacturer({
      name,
      image: image || '',
      categories: categories || [],
      location: location || '',
      type,
      moq: moq || 0,
      priceRange: priceRange || 'medium',
      links: links || { website: '', instagram: '', facebook: '', linkedin: '' },
      contact: contact || { email: '', phone: '' }
    });
    await manufacturer.save();
    res.status(201).json(manufacturer);
  } catch (err) {
    console.error('Create manufacturer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateManufacturer = async (req, res) => {
  try {
    const { name, image, categories, location, type, moq, priceRange, links, contact } = req.body;
    const manufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      { name, image, categories, location, type, moq, priceRange, links, contact },
      { new: true, runValidators: true }
    );
    if (!manufacturer) return res.status(404).json({ message: 'Manufacturer not found' });
    res.json(manufacturer);
  } catch (err) {
    console.error('Update manufacturer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
    if (!manufacturer) return res.status(404).json({ message: 'Manufacturer not found' });
    res.json({ message: 'Manufacturer deleted successfully' });
  } catch (err) {
    console.error('Delete manufacturer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Items CRUD ────────────────────────────────────────────────

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, category, image } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }
    const item = new Item({ name, category, image: image || '' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, category, image } = req.body;
    const update = { name, category, image };
    if (name) {
      update.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
