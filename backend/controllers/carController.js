const fs = require('fs');
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

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Automobilis nerastas' });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: 'Serverio klaida' });
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

const deleteCar = (req, res) => {
  const { id } = req.params;

  Car.findByIdAndDelete(id)
    .then((deletedCar) => {
      if (!deletedCar) {
        return res.status(404).json({ message: 'Automobilis nerastas' });
      }

      if (deletedCar.image) {
        const imagePath = path.join(__dirname, '../uploads', path.basename(deletedCar.image));

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Nepavyko ištrinti nuotraukos:', err);
            return res.status(500).json({ message: 'Nepavyko ištrinti nuotraukos' });
          }
          console.log('Nuotrauka ištrinta sėkmingai');
        });
      }

      res.status(200).json({ message: 'Automobilio įrašas ištrintas sėkmingai' });
    })
    .catch((err) => {
      console.error('Klaida trinant automobilio įrašą:', err);
      res.status(500).json({ message: 'Klaida trinant automobilio įrašą', error: err });
    });
};

const updateCar = async (req, res) => {
  const { id } = req.params;

  try {
    let car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: 'Automobilis nerastas' });

    if (req.file) {
      if (car.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(car.image));
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Nepavyko ištrinti seno paveikslėlio:', err);
        });
      }
      car.image = `/uploads/${req.file.filename}`;
    }

    Object.assign(car, req.body);
    const updatedCar = await car.save();

    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ message: 'Klaida atnaujinant automobilį', error: err });
  }
};

module.exports = {
  getAllCars,
  createCar,
  getCarModels,
  deleteCar,
  updateCar,
  getCarById,
};
