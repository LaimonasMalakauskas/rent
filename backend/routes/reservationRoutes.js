const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, deleteReservation, updateReservation, getAllReservations  } = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/', getAllReservations);
router.get('/user/:userId', getUserReservations);
router.delete('/:id', deleteReservation);
router.put('/:id', updateReservation);

module.exports = router;
