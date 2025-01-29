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

  if (!model || typeof model !== 'string' || model.trim() === '') {
    return res.status(400).json({ message: 'Modelio pavadinimas yra privalomas' });
  }

  if (price === undefined || price === null || isNaN(price) || price <= 0) {
    return res.status(400).json({ message: 'Kaina turi būti teigiamas skaičius' });
  }

  const newCar = new Car({
    model,
    price: Number(price),
    available: available ?? false, 
  });

  try {
    const savedCar = await newCar.save();
    console.log('Automobilis sėkmingai išsaugotas:', savedCar);
    res.status(201).json(savedCar);
  } catch (err) {
    console.error('Klaida išsaugant automobilį:', err);
    res.status(500).json({ message: 'Serverio klaida, bandykite vėliau' });
  }
};


module.exports = {
  getAllCars,
  createCar,
};
