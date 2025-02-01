import React, { useState } from 'react';

const ReservationForm = ({ car, user, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      setError('Pabaigos data negali būti ankstesnė už pradžios datą.');
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

    if (!reservationData.userId) {
      setError("Prisijungimo klaida: vartotojas nerastas");
      return;
    }

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">Rezervacijos pradžia</label>
        <input
          type="date"
          id="startDate"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">Rezervacijos pabaiga</label>
        <input
          type="date"
          id="endDate"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-outline-primary border-3" disabled={isLoading}>
        {isLoading ? 'Kraunama...' : 'Atlikti rezervaciją'}
      </button>
      {error && <p className="text-danger mt-3">{error}</p>}
    </form>
  );
};

export default ReservationForm;
