const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { getAllCars, createCar } = require('../controllers/carController');

router.route('/').get(getAllCars).post(upload.single('image'), createCar);

module.exports = router;