const express = require('express')
const router = express.Router()

const { getAllCars, createCar } = require('../controllers/carController');

router.route('/').get(getAllCars).post(createCar)

module.exports = router