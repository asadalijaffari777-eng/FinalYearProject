const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controller/adminController');

router.use(verifyToken, adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/manufacturers', adminController.getManufacturers);
router.post('/manufacturers', adminController.createManufacturer);
router.put('/manufacturers/:id', adminController.updateManufacturer);
router.delete('/manufacturers/:id', adminController.deleteManufacturer);
router.get('/items', adminController.getItems);
router.post('/items', adminController.createItem);
router.put('/items/:id', adminController.updateItem);
router.delete('/items/:id', adminController.deleteItem);

module.exports = router;
