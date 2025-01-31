const Reservation = require('../models/reservationModel');

const createReservation = async (req, res) => {
  const { userId, carId, startDate, endDate } = req.body;

  console.log("Received userId:", userId);
  console.log("Received carId:", carId);

  if (!userId) {
    return res.status(400).json({ message: "Vartotojo ID yra privalomas." });
  }

  try {
    const newReservation = new Reservation({
      user: userId,
      car: carId,
      startDate,
      endDate,
    });

    console.log("Saving reservation:", newReservation);
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error while creating reservation:", error);
    res.status(500).json({ message: "Nepavyko sukurti rezervacijos", error });
  }
};


module.exports = {
  createReservation,
};
