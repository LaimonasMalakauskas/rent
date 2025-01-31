import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import CarInfo from '../components/CarInfo';
import ReservationForm from '../components/ReservationForm';

const DetailedInfoPage = ({ user }) => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/cars/${id}`)
      .then((response) => response.json())
      .then((data) => setCar(data))
      .catch((error) => console.error('Klaida gaunant automobilį:', error));
  }, [id]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (!car) return <p>Kraunama...</p>;

  return (
    <>
      <div className="m-5">
        <button
          onClick={handleGoHome}
          className="btn btn-outline-secondary border-3 d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          Grįžti
        </button>
      </div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <CarInfo car={car} />
          </div>
          {user && user.role === 'user' && (
            <div className="col-md-3 my-5">
              <h4>Atlikti rezervaciją</h4>
              <ReservationForm car={car} user={user} />
            </div>
          )}
        </div>
      </div>
    </>
  );

};

export default DetailedInfoPage;
