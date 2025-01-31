const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, deleteReservation, updateReservation } = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/user/:userId', getUserReservations);
router.delete('/:id', deleteReservation);
router.put('/:id', updateReservation);  // Pridėkite PUT užklausą

module.exports = router;
