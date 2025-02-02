import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const AllReservedCars = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStartDate, setNewStartDate] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);
  const [newStatus, setNewStatus] = useState("waiting");
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reservations");
        if (!response.ok) {
          throw new Error(`Serverio klaida: ${response.status}`);
        }
        const data = await response.json();
        setReservations(data);

        const dates = data.map((reservation) => {
          const startDate = new Date(reservation.startDate);
          const endDate = new Date(reservation.endDate);

          startDate.setHours(startDate.getHours() + startDate.getTimezoneOffset() / 60);
          endDate.setHours(endDate.getHours() + endDate.getTimezoneOffset() / 60);

          return {
            carId: reservation.car._id,
            start: new Date(startDate),
            end: new Date(endDate),
          };
        });

        console.log("Gautos rezervacijos iš backend:", data);
        console.log("Apdorotos rezervacijos datos (naudojamos filtravimui):", dates);

        setReservedDates(dates);
      } catch (err) {
        setError(`Klaida: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);


  const isDateReserved = (date, carId) => {
    const checkDate = new Date(date);
    checkDate.setUTCHours(0, 0, 0, 0);

    return reservedDates.some((reserved) => {
      if (reserved.carId !== carId) return false;

      const reservedStart = new Date(reserved.start);
      reservedStart.setUTCHours(0, 0, 0, 0);

      const reservedEnd = new Date(reserved.end);
      reservedEnd.setUTCHours(23, 59, 59, 999);

      return checkDate >= reservedStart && checkDate <= reservedEnd;
    });
  };


  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setNewStartDate(new Date(reservation.startDate));
    setNewEndDate(new Date(reservation.endDate));
    setNewStatus(reservation.status);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    const hasDateChanged =
      newStartDate && newEndDate &&
      (newStartDate.getTime() !== new Date(selectedReservation.startDate).getTime() || newEndDate.getTime() !== new Date(selectedReservation.endDate).getTime());

    const updatedReservation = {
      ...(hasDateChanged
        ? { startDate: newStartDate.toISOString(), endDate: newEndDate.toISOString() }
        : {}),
      status: newStatus,
    };

    let isDateConflict = false;
    if (hasDateChanged) {
      isDateConflict = reservations.some((reservation) => {
        const startDate = new Date(reservation.startDate).getTime();
        const endDate = new Date(reservation.endDate).getTime();

        return (
          reservation.car._id === selectedReservation.car._id &&
          (
            (newStartDate.getTime() >= startDate && newStartDate.getTime() < endDate) ||
            (newEndDate.getTime() > startDate && newEndDate.getTime() <= endDate) ||
            (newStartDate.getTime() <= startDate && newEndDate.getTime() >= endDate)
          )
        );
      });
    }

    if (!isDateConflict || !hasDateChanged) {
      try {
        const response = await fetch(`http://localhost:5000/api/reservations/${selectedReservation._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReservation),
        });

        if (!response.ok) {
          throw new Error("Klaida atnaujinant rezervaciją");
        }

        const data = await response.json();
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation._id === data._id ? { ...reservation, ...updatedReservation } : reservation
          )
        );

        setShowModal(false);
        window.location.reload();
      } catch (err) {
        setError(`Klaida: ${err.message}`);
      }
    } else {
      setError("Pasirinktos datos jau užimtos šiam automobiliui.");
    }
  };

  const handleStartDateChange = (date) => {
    const correctedDate = new Date(date);
    correctedDate.setUTCHours(0, 0, 0, 0);
    console.log('Pasirinkta pradžios data:', correctedDate.toISOString().slice(0, 10));
    setNewStartDate(correctedDate);
  };


  const handleEndDateChange = (date) => {
    const correctedDate = new Date(date);
    correctedDate.setUTCHours(0, 0, 0, 0);

    if (correctedDate < newStartDate) {
      console.log('Pasirinkta pabaigos data negali būti anksčiau už pradžios datą.');
      return;
    }

    console.log('Pasirinkta pabaigos data:', correctedDate.toISOString());
    setNewEndDate(correctedDate);
  };


  if (loading) return <p className="text-center">Kraunama...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  const groupedReservations = reservations.reduce((groups, reservation) => {
    const email = reservation.user.email;
    if (!groups[email]) {
      groups[email] = [];
    }
    groups[email].push(reservation);
    return groups;
  }, {});

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Visos rezervacijos</h2>
      <div className="accordion" id="reservationsAccordion">
        {Object.keys(groupedReservations).map((email, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="true"
                aria-controls={`collapse${index}`}
              >
                {email}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse show"
              aria-labelledby={`heading${index}`}
              data-bs-parent="#reservationsAccordion"
            >
              <div className="accordion-body">
                {groupedReservations[email].map((reservation) => (
                  <table className="table table-striped" key={reservation._id}>
                    <thead>
                      <tr>
                        <th>Automobilis</th>
                        <th>Pradžios data</th>
                        <th>Pabaigos data</th>
                        <th>Statusas</th>
                        <th>Veiksmai</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {reservation.car ? `${reservation.car.model}` : "Nežinomas automobilis"}
                        </td>
                        <td>{new Date(reservation.startDate).toLocaleDateString('lt-LT', { timeZone: 'UTC' })}</td>
                        <td>{new Date(reservation.endDate).toLocaleDateString('lt-LT', { timeZone: 'UTC' })}</td>
                        <td>{reservation.status}</td>
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEditClick(reservation)}
                          >
                            Redaguoti
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
          aria-labelledby="editReservationModal"
          aria-hidden={showModal ? "false" : "true"}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editReservationModal">
                  Redaguoti rezervaciją
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label">Pradžios data</label>
                  <DatePicker
                    id="startDate"
                    selected={newStartDate}
                    onChange={handleStartDateChange}
                    minDate={new Date()}
                    filterDate={(date) => !isDateReserved(date, selectedReservation?.car?._id)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />


                </div>
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">Pabaigos data</label>
                  <DatePicker
                    id="endDate"
                    selected={newEndDate}
                    onChange={handleEndDateChange}
                    minDate={newStartDate || new Date()}
                    filterDate={(date) => !isDateReserved(date, selectedReservation?.car?._id)}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Statusas</label>
                  <select
                    id="status"
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="waiting">Laukiama</option>
                    <option value="confirmed">Patvirtinta</option>
                    <option value="cancelled">Atšaukta</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Uždaryti
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                  Išsaugoti pakeitimus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReservedCars;
