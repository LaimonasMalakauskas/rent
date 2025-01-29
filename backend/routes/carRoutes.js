const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { getAllCars, createCar, getCarModels } = require('../controllers/carController');

router.route('/').get(getAllCars).post(upload.single('image'), createCar);
router.route('/models').get(getCarModels)

module.exports = router;