import React, { useEffect, useState } from "react";

const AllReservedCars = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newStatus, setNewStatus] = useState("waiting");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reservations");

        if (!response.ok) {
          throw new Error(`Serverio klaida: ${response.status}`);
        }

        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(`Klaida: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setNewStartDate(new Date(reservation.startDate).toLocaleDateString());
    setNewEndDate(new Date(reservation.endDate).toLocaleDateString());
    setNewStatus(reservation.status);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {

    const updatedReservation = {
      startDate: newStartDate,
      endDate: newEndDate,
      status: newStatus, 
    };

    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${selectedReservation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReservation),
      });

      if (!response.ok) {
        throw new Error('Klaida atnaujinant rezervaciją');
      }

      const data = await response.json();

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === data._id ? { ...reservation, startDate: data.startDate, endDate: data.endDate, status: data.status } : reservation
        )
      );

      setShowModal(false);
    } catch (err) {
      setError(`Klaida: ${err.message}`);
    }
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
                        <td>{new Date(reservation.startDate).toLocaleDateString()}</td>
                        <td>{new Date(reservation.endDate).toLocaleDateString()}</td>
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
        <div className="modal fade show" tabIndex="-1" style={{ display: "block" }} aria-labelledby="editReservationModal" aria-hidden="true">
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
                  <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">Pabaigos data</label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
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
