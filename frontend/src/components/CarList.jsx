import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import CarFilter from './CarFilter';

const CarList = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/cars')
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error('Klaida gaunant automobilius:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/cars/models')
      .then((response) => response.json())
      .then((data) => setModels(data))
      .catch((error) => console.error('Klaida gaunant modelius:', error));
  }, []);

  const deleteCar = (carId) => {
    fetch(`http://localhost:5000/api/cars/${carId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setCars(cars.filter((car) => car._id !== carId))
          alert('Automobilio įrašas ištrintas sėkmingai');
        } else {
          alert('Klaida, ištrinti automobilio įrašo nepavyko');
        }
      })
      .catch((error) => {
        console.error('Klaida, ištrinti automobilio įrašo nepavyko', error);
        alert('Klaida, ištrinti automobilio įrašo nepavyko');
      });
  };

  const filteredCars = cars.filter((car) => {
    if ((!user || user.role === 'user') && !car.available) return false;

    if (user?.role === 'admin') {
      if (filter === 'available' && !car.available) return false;
      if (filter === 'unavailable' && car.available) return false;
    }

    if (minPrice && car.price < minPrice) return false;
    if (maxPrice && car.price > maxPrice) return false;

    if (selectedModel !== 'all' && car.model !== selectedModel) return false;

    return true;
  });


  const handleEdit = (carId) => {
    console.log('Redaguoti automobilį:', carId);

  };
  
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-12 mb-4">
          <h2 className="mb-4">Turimi Automobiliai</h2>

          {user?.role === 'admin' ? (
            <CarFilter
              filter={filter}
              setFilter={setFilter}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          ) : (
            <CarFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              hideAvailability={true}
            />
          )}

          {filteredCars.length === 0 ? (
            <p className="text-muted">Nėra įrašytų automobilių.</p>
          ) : (
            <div className="row">
              {filteredCars.map((car) => (
                <div key={car._id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="car-image position-relative">
                      {car.image && (
                        <img
                          src={`http://localhost:5000${car.image}`}
                          alt={car.model}
                          className="img-fluid"
                        />
                      )}
                 
                      {user?.role === 'admin' && (
                        <div className="position-absolute top-0 end-0 p-2">
                          <FaEdit
                            onClick={() => handleEdit(car._id)}
                            className="text-primary me-2 icon"
                            size={24}
                          />
                          <FaTrashAlt
                            onClick={() => deleteCar(car._id)}
                            className="text-danger icon"
                            size={24}
                          />
                        </div>
                      )}
                    </div>
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
