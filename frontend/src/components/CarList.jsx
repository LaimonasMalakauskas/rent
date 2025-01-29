import React, { useState, useEffect } from 'react';
import CarFilter from './CarFilter'; 

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/cars')
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error('Error fetching cars:', error));
  }, []);

  const filteredCars = cars.filter((car) => {
    if (filter === 'available' && !car.available) return false;
    if (filter === 'unavailable' && car.available) return false;

    if (minPrice && car.price < minPrice) return false;
    if (maxPrice && car.price > maxPrice) return false;

    return true;
  });

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12 mb-4">
          <h2 className="mb-4">Turimi Automobiliai</h2>
          <CarFilter 
            filter={filter} 
            setFilter={setFilter} 
            minPrice={minPrice} 
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
          {filteredCars.length === 0 ? (
            <p className="text-muted">Nėra įrašytų automobilių.</p>
          ) : (
            <div className="row">
              {filteredCars.map((car) => (
                <div key={car._id} className="col-md-4 mb-4">
                  <div className="card">
                    <img
                      src={car.image ? `http://localhost:5000${car.image}` : 'https://via.placeholder.com/150'}
                      className="card-img-top"
                      alt={car.model}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{car.model}</h5>
                      <p className="card-text">Kaina: €{car.price.toFixed(2)}</p>
                      <p className="card-text">
                        Pridėta: {new Date(car.createdAt).toLocaleString('lt-LT')}
                      </p>
                      <p>
                        {car.available ? (
                          <span className="badge bg-success">Pasiekiamas</span>
                        ) : (
                          <span className="badge bg-danger">Nepasiekiamas</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarList;
