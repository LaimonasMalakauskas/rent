const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'waiting', enum: ['waiting', 'confirmed', 'cancelled'] },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
