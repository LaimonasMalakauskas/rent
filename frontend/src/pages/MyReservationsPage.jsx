import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { FaCar, FaCalendarAlt, FaUsers, FaCogs, FaLuggageCart, FaEuroSign, FaCheckCircle, FaTimesCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';

const MyReservationsPage = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReservation, setEditedReservation] = useState(null);
  const [error, setError] = useState('');
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/reservations/user/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);

        const dates = [];
        data.forEach(reservation => {
          if (reservation.car?._id === editedReservation?.car?._id) {
            let startDate = new Date(reservation.startDate);
            let endDate = new Date(reservation.endDate);

            startDate.setUTCHours(0, 0, 0, 0); 
            endDate.setUTCHours(0, 0, 0, 0);  

            while (startDate <= endDate) {
              dates.push(startDate.toISOString().split('T')[0]); 
              startDate.setUTCDate(startDate.getUTCDate() + 1);  
            }
          }
        });
        setReservedDates(dates);
      })
      .catch((error) => {
        console.error('Klaida gaunant rezervacijas:', error);
        setLoading(false);
      });
  }, [user, editedReservation?.car]);

  const isDateReserved = (date) => reservedDates.includes(date);

  const deleteReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Nepavyko ištrinti rezervacijos');
      }

      setReservations(reservations.filter((reservation) => reservation._id !== reservationId));
    } catch (error) {
      console.error('Klaida trinant rezervaciją:', error);
    }
  };

  const handleEdit = (reservation) => {
    setIsEditing(true);
    setEditedReservation(reservation);
    setError('');
  };

  const handleEditedReservation = async () => {
    if (!editedReservation.startDate || !editedReservation.endDate) {
      alert("Prašome įvesti teisingas datas.");
      return;
    }

    const newStartDate = new Date(editedReservation.startDate);
    const newEndDate = new Date(editedReservation.endDate);

    const isDateConflict = reservations.some((reservation) => {
      if (reservation.car._id !== editedReservation.car._id) {
        return false;
      }

      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      return (
        (newStartDate >= startDate && newStartDate < endDate) ||
        (newEndDate > startDate && newEndDate <= endDate) ||
        (newStartDate <= startDate && newEndDate >= endDate)
      );
    });

    if (isDateConflict) {
      setError('Pasirinktos datos jau užimtos.');
      return;
    }

    try {
      const updatedReservation = {
        ...editedReservation,
        startDate: new Date(editedReservation.startDate).toISOString(),
        endDate: new Date(editedReservation.endDate).toISOString(),
      };

      const response = await fetch(`http://localhost:5000/api/reservations/${editedReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReservation),
      });

      if (!response.ok) {
        throw new Error('Nepavyko atnaujinti rezervacijos');
      }

      const updated = await response.json();

      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === updated._id ? { ...reservation, startDate: updated.startDate, endDate: updated.endDate } : reservation
        )
      );

      setIsEditing(false);
      setEditedReservation(null);
    } catch (error) {
      console.error('Klaida atnaujinant rezervaciją:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReservation(null);
    setError('');
  };

  if (loading) return <p>Kraunama...</p>;
  if (!reservations.length) return <div className='p-5 m-5'><h2>Jūs neturite rezervacijų!</h2></div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Mano rezervacijos</h2>
      <div className="row">
        {reservations.map((reservation) => (
          <div key={reservation._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="car-image position-relative">
                <h5 className="card-title text-light m-2">{reservation.car?.brand} {reservation.car?.model}</h5>
                {reservation.car?.image && (
                  <img
                    src={`http://localhost:5000${reservation.car.image}`}
                    alt={reservation.car?.model}
                    className="card-img-top img-fluid rounded mt-2 p-3"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
              </div>
              <div className="position-absolute top-0 end-0 p-2 d-flex">
                <FaEdit
                  onClick={() => handleEdit(reservation)}
                  className="text-primary me-2 icon"
                  size={24}
                />
                <FaTrashAlt
                  onClick={() => deleteReservation(reservation._id)}
                  className="text-danger icon"
                  size={24}
                />
              </div>
              <div className="card-body">
                <p className="card-text">
                  <FaEuroSign style={{ marginRight: '8px' }} />
                  <strong>Kaina:</strong> €{(reservation.car?.price ?? 0).toFixed(2)}
                </p>
                <p className="card-text">
                  <FaUsers style={{ marginRight: '8px' }} />
                  <strong>Keleivių skaičius:</strong> {reservation.car?.passengers}
                </p>
                <p className="card-text">
                  <FaCar style={{ marginRight: '8px' }} />
                  <strong>Durelių skaičius:</strong> {reservation.car?.doors}
                </p>
                <p className="card-text">
                  <FaCogs style={{ marginRight: '8px' }} />
                  <strong>Pavarų tipas:</strong> {reservation.car?.gears}
                </p>
                <p className="card-text">
                  <FaLuggageCart style={{ marginRight: '8px' }} />
                  <strong>Bagažo talpa:</strong> {reservation.car?.capacity} krepšiai
                </p>
                <p className="card-text">
                  <FaCalendarAlt style={{ marginRight: '8px' }} />
                  <strong>Pradžia:</strong> {new Date(reservation.startDate).toISOString().split('T')[0]}
                </p>
                <p className="card-text">
                  <FaCalendarAlt style={{ marginRight: '8px' }} />
                  <strong>Pabaiga:</strong> {new Date(reservation.endDate).toISOString().split('T')[0]}
                </p>
                <p className="card-text">
                  <strong>Statusas: </strong>
                  {reservation.status === 'waiting' && (
                    <span className="badge bg-warning">
                      <FaTimesCircle style={{ marginRight: '5px' }} /> Laukiama
                    </span>
                  )}
                  {reservation.status === 'confirmed' && (
                    <span className="badge bg-success">
                      <FaCheckCircle style={{ marginRight: '5px' }} /> Patvirtinta
                    </span>
                  )}
                  {reservation.status === 'cancelled' && (
                    <span className="badge bg-danger">
                      <FaTimesCircle style={{ marginRight: '5px' }} /> Atšaukta
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && editedReservation && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Redaguoti rezervaciją</h5>
                <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Pradžios data</label>
                    <DatePicker
                      selected={new Date(editedReservation.startDate)}
                      onChange={(date) => {
                        const adjustedDate = new Date(date.setUTCHours(0, 0, 0, 0)); 
                        setEditedReservation({ ...editedReservation, startDate: adjustedDate });
                      }}
                      minDate={new Date()}
                      excludeDates={reservedDates.map(date => new Date(date))}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">Pabaigos data</label>
                    <DatePicker
                      selected={new Date(editedReservation.endDate)}
                      onChange={(date) => {
                        const adjustedDate = new Date(date.setUTCHours(0, 0, 0, 0)); 
                        setEditedReservation({ ...editedReservation, endDate: adjustedDate });
                      }}
                      minDate={new Date()}
                      excludeDates={reservedDates.map(date => new Date(date))}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                </form>
                {error && <p className="text-danger">{error}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Atšaukti</button>
                <button type="button" className="btn btn-primary" onClick={handleEditedReservation}>Išsaugoti</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
