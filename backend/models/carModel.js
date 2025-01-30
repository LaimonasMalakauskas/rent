const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, 'Please add model'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add price'],
      min: [0, 'Price must be a positive number'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: [true, 'Please add image'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please add capacity'],
    },
    passengers: {
      type: Number,
      required: [true, 'Please add passengers number'],
    },
    doors: {
      type: Number,
      required: [true, 'Please add doors number'],
    },
    gears: {
      type: String,
      required: [true, 'Please add gears type'],
    },
  },
  {
    timestamps: true,
  }
);


const Car = mongoose.model('Car', carSchema);

module.exports = Car;
