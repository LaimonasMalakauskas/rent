import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

const ReservationForm = ({ car, user, onSuccess }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reservedDates, setReservedDates] = useState([]);

  const today = new Date();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reservations?carId=${car?._id}`);
        if (!response.ok) {
          throw new Error('Nepavyko gauti rezervacijų');
        }
        const data = await response.json();
        
        const bookedDates = [];
        data.forEach(reservation => {
          if (reservation.car._id === car._id) {
            let currentDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);
            while (currentDate <= endDate) {
              bookedDates.push(currentDate.toISOString().split('T')[0]);
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
        });

        setReservedDates(bookedDates);
      } catch (err) {
        console.error('Klaida gaunant rezervacijas:', err);
      }
    };

    if (car?._id) {
      fetchReservations();
    }
  }, [car]);

  const isDateReserved = (date) => reservedDates.includes(date);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      setError('Pabaigos data negali būti ankstesnė už pradžios datą.');
      return;
    }

    if (isDateReserved(startDate) || isDateReserved(endDate)) {
      setError('Pasirinkta data jau rezervuota.');
      return;
    }

    setError('');
    setIsLoading(true);

    const reservationData = {
      userId: user?.id,
      carId: car?._id,
      startDate,
      endDate,
    };

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      setIsLoading(false);

      if (!response.ok) {
        throw new Error('Nepavyko atlikti rezervacijos');
      }

      const data = await response.json();
      console.log('Rezervacija sukurta:', data);

      onSuccess();
      
    } catch (error) {
      setIsLoading(false);
      setError('Klaida kuriant rezervaciją');
      console.error('Klaida:', error);
    }
  };

  const handleStartDateChange = (date) => {
    if (date) {
      const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      setStartDate(adjustedDate.toISOString().split('T')[0]);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      setEndDate(adjustedDate.toISOString().split('T')[0]);
    } else {
      setEndDate(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">Rezervacijos pradžia</label>
        <DatePicker
          selected={startDate ? new Date(startDate) : null}
          onChange={handleStartDateChange}
          minDate={today}
          dateFormat="yyyy-MM-dd"
          excludeDates={reservedDates.map(date => new Date(date))}
          placeholderText="Pasirinkite pradžios datą"
          className="form-control"
          required
        />
        {isDateReserved(startDate) && <p className="text-danger">Ši data jau rezervuota!</p>}
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">Rezervacijos pabaiga</label>
        <DatePicker
          selected={endDate ? new Date(endDate) : null}
          onChange={handleEndDateChange}
          minDate={startDate ? new Date(startDate) : today}
          dateFormat="yyyy-MM-dd"
          excludeDates={reservedDates.map(date => new Date(date))}
          placeholderText="Pasirinkite pabaigos datą"
          className="form-control"
          required
        />
        {isDateReserved(endDate) && <p className="text-danger">Ši data jau rezervuota!</p>}
      </div>
      <button type="submit" className="btn btn-outline-primary border-3" disabled={isLoading}>
        {isLoading ? 'Kraunama...' : 'Atlikti rezervaciją'}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </form>
  );
};

export default ReservationForm;
