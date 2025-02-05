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
  const [userFilter, setUserFilter] = useState("");

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

  // Filtruojame rezervacijas pagal naudotojo el. paštą
  const filteredReservations = reservations.filter((reservation) =>
    reservation.user.email.toLowerCase().includes(userFilter.toLowerCase())
  );

  // Sukuriame grupes pagal naudotoją tik iš jau filtruotų rezervacijų
  const groupedReservations = filteredReservations.reduce((groups, reservation) => {
    const email = reservation.user.email;
    if (!groups[email]) {
      groups[email] = [];
    }
    groups[email].push(reservation);
    return groups;
  }, {});

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm("Ar tikrai norite ištrinti šią rezervaciją?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Klaida šalinant rezervaciją");
      }

      setReservations((prev) => prev.filter((reservation) => reservation._id !== reservationId));
    } catch (err) {
      setError(`Klaida: ${err.message}`);
    }
  };

  return (
    <div >
      <div className="container mt-4">
        <h2 className="text-center mb-4">Visos rezervacijos</h2>

        <div className="mb-3">
          <input
            type="text"
            id="userFilter"
            className="form-control"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            placeholder="Įveskite naudotojo el. paštą"
          />
        </div>

        {Object.keys(groupedReservations).map((email, index) => (
          <div className="card mb-4 shadow-sm" key={index}>
            <div className="card-header bg-dark text-light fw-bold">
              {email}
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Automobilis</th>
                      <th>Pradžios data</th>
                      <th>Pabaigos data</th>
                      <th>Statusas</th>
                      <th colSpan="2" className="text-center">Veiksmai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedReservations[email].map((reservation) => (
                      <tr key={reservation._id}>
                        <td>{reservation.car ? reservation.car.model : "Nežinomas automobilis"}</td>
                        <td>{new Date(reservation.startDate).toLocaleDateString('lt-LT', { timeZone: 'UTC' })}</td>
                        <td>{new Date(reservation.endDate).toLocaleDateString('lt-LT', { timeZone: 'UTC' })}</td>
                        <td>
                          <span
                            className={`badge ${reservation.status === "confirmed"
                              ? "bg-success"
                              : reservation.status === "cancelled"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                              }`}
                          >
                            {reservation.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary border-2"
                            onClick={() => handleEditClick(reservation)}
                          >
                            Redaguoti
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger border-2"
                            onClick={() => handleDeleteReservation(reservation._id)}
                          >
                            Ištrinti
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
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
            <div className="modal-content border">
              <div className="modal-header bg-dark" data-bs-theme="dark">
                <h5 className="modal-title text-light" id="editReservationModal">
                  Redaguoti rezervaciją
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Naudotojas - {selectedReservation.user.email}</label>
                </div>
                <div className="mb-3">
                  <label className="form-label">Automobilis - {selectedReservation.car ? selectedReservation.car.model : "Nežinomas automobilis"}</label>
                </div>
                <hr />
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label">Pradžios data</label>
                  <div>
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
                </div>
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">Pabaigos data</label>
                  <div>
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
              <div className="modal-footer bg-dark">
                <button type="button" className="btn btn-outline-danger" onClick={() => setShowModal(false)}>
                  Uždaryti
                </button>
                <button type="button" className="btn btn-outline-primary" onClick={handleSaveChanges}>
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
