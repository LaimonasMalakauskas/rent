const Car = require('../models/carModel');

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCar = async (req, res) => {
  console.log('Gaunami duomenys iš kliento:', req.body);

  const { model, price, available } = req.body;

  if (!model || price === undefined) {
    return res.status(400).json({ message: 'Modelis ir kaina yra privalomi' });
  }

  const newCar = new Car({
    model,
    price,
    available,
  });

  try {
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  getAllCars,
  createCar,
};
