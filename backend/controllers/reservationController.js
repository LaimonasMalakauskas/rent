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

const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Gauname rezervacijas vartotojui:", userId);

    const reservations = await Reservation.find({ user: userId }).populate('car');
    if (reservations.length === 0) {
      return res.status(404).json({ message: "Rezervacijų nerasta" });
    }

    res.json(reservations);
  } catch (error) {
    console.error("Nepavyko gauti rezervacijų:", error);
    res.status(500).json({ message: 'Nepavyko gauti rezervacijų', error });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: "Rezervacija nerasta" });
    }

    res.status(200).json({ message: "Rezervacija sėkmingai ištrinta" });
  } catch (error) {
    console.error("Klaida trinant rezervaciją:", error);
    res.status(500).json({ message: "Nepavyko ištrinti rezervacijos", error });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { id } = req.params; 
    const { startDate, endDate } = req.body;  

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Rezervacija nerasta" });
    }

    reservation.startDate = startDate || reservation.startDate;
    reservation.endDate = endDate || reservation.endDate;

    await reservation.save();
    res.status(200).json(reservation); 
  } catch (error) {
    console.error("Klaida atnaujinant rezervaciją:", error);
    res.status(500).json({ message: "Nepavyko atnaujinti rezervacijos", error });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  deleteReservation,
  updateReservation, 
};
