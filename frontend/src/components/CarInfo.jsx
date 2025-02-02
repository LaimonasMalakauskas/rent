import React from 'react';
import { FaCar, FaUsers, FaLuggageCart, FaCogs, FaCheckCircle, FaTimesCircle, FaEuroSign } from 'react-icons/fa';

const CarInfo = ({ car, user }) => {
  return (
    <div className="container my-5">
      <div className="card shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="car-image position-relative">
          <h2 className="card-title text-light m-2">{car.model}</h2>
          {car.image && (
            <img
              src={`http://localhost:5000${car.image}`}
              alt={car.model}
              className="card-img-top img-fluid rounded mt-2 p-5"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="card-body">
          <p className="card-text">
            <FaEuroSign style={{ marginRight: '8px' }} />
            <strong>Kaina:</strong> €{car.price.toFixed(2)}/diena
          </p>
          <p className="card-text">
            <FaUsers style={{ marginRight: '8px' }} />
            <strong>Keleivių skaičius:</strong> {car.passengers}
          </p>
          <p className="card-text">
            <FaCar style={{ marginRight: '8px' }} />
            <strong>Durelių skaičius:</strong> {car.doors}
          </p>
          <p className="card-text">
            <FaCogs style={{ marginRight: '8px' }} />
            <strong>Pavarų tipas:</strong> {car.gears}
          </p>
          <p className="card-text">
            <FaLuggageCart style={{ marginRight: '8px' }} />
            <strong>Bagažo talpa:</strong> {car.capacity} krepšiai
          </p>
          {user?.role === 'admin' && (
            <p className="card-text">
              <strong>Statusas:</strong>{' '}
              {car.available ? (
                <span className="badge bg-success">
                  <FaCheckCircle style={{ marginRight: '5px' }} /> Pasiekiamas
                </span>
              ) : (
                <span className="badge bg-danger">
                  <FaTimesCircle style={{ marginRight: '5px' }} /> Nepasiekiamas
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarInfo;
