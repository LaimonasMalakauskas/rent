import React, { useState, useEffect } from 'react';
import CarFilter from './CarFilter'; 

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/cars')
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error('Error fetching cars:', error));
  }, []);

  const filteredCars = cars.filter((car) => {
    if (filter === 'available') return car.available;
    if (filter === 'unavailable') return !car.available;
    return true;
  });

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12 mb-4">
          <h2 className="mb-4">Turimi Automobiliai</h2>
          <CarFilter filter={filter} setFilter={setFilter} />
          {filteredCars.length === 0 ? (
            <p className="text-muted">Nėra įrašytų automobilių.</p>
          ) : (
            <ul className="list-group">
              {filteredCars.map((car) => (
                <li
                  key={car._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <h5 className="mb-1">{car.model}</h5>
                    <p className="mb-1">Kaina: €{car.price.toFixed(2)}</p>
                    <small className="text-muted">
                      Pridėta: {new Date(car.createdAt).toLocaleString('lt-LT')}
                    </small>
                  </div>
                  <div>
                    {car.available ? (
                      <span className="badge bg-success">Pasiekiamas</span>
                    ) : (
                      <span className="badge bg-danger">Nepasiekiamas</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarList;
