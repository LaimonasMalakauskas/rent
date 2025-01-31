import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import CarInfo from '../components/CarInfo';

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

  const handleReserve = () => {
    console.log(`Rezervuotas automobilis su ID: ${id}`);
  };

  if (!car) return <p>Kraunama...</p>;

  return (
    <>
      <div className="d-flex justify-content-between m-5">
        <button
          onClick={handleGoHome}
          className="btn btn-outline-secondary border-3 d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          Grįžti
        </button>
  
        {user && user.role === 'user' && (
          <button
            onClick={handleReserve}
            className="btn btn-outline-primary border-3"
          >
            Atlikti rezervaciją
          </button>
        )}
      </div>
  
      <CarInfo car={car} />
    </>
  );
  
};

export default DetailedInfoPage;
