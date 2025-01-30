const path = require('path');
const Car = require('../models/carModel');

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCarModels = async (req, res) => {
  try {
    const models = await Car.distinct('model');
    res.json(models);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCar = async (req, res) => {
  console.log('Gaunami duomenys iš kliento:', req.body);
  console.log('Gautas failas:', req.file);

  const { model, price, available, capacity, passengers, doors, gears } = req.body;
  const imagePath = req.file ? `/uploads/${path.basename(req.file.path)}` : null;

  if (!model || price === undefined) {
    return res.status(400).json({ message: 'Modelis ir kaina yra privalomi' });
  }

  const newCar = new Car({
    model,
    price,
    available,
    image: imagePath,
    capacity, 
    passengers, 
    doors, 
    gears,
  });

  try {
    const savedCar = await newCar.save();
    console.log('Įrašytas automobilis:', savedCar);
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



module.exports = {
  getAllCars,
  createCar,
  getCarModels,
};
