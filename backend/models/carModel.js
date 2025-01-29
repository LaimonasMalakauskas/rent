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
    },
  },
  {
    timestamps: true,
  }
);


const Car = mongoose.model('Car', carSchema);

module.exports = Car;
