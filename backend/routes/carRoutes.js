const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { getAllCars, createCar, getCarModels, deleteCar, updateCar } = require('../controllers/carController');

router.route('/').get(getAllCars).post(upload.single('image'), createCar);
router.route('/models').get(getCarModels)

router.route('/:id').put(upload.single('image'), updateCar).delete(deleteCar);

module.exports = router;