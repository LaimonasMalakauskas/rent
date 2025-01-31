import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import CarFilter from './CarFilter';

const CarList = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');
  const [models, setModels] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const navigate = useNavigate();

  const handleInfoClick = (carId) => {
    navigate(`/info/${carId}`);
  };

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

  const handleEdit = (carId) => {
    const carToEdit = cars.find((car) => car._id === carId);
    setEditingCar(carToEdit);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('model', editingCar.model);
    formData.append('price', editingCar.price);
    formData.append('capacity', editingCar.capacity);
    formData.append('passengers', editingCar.passengers);
    formData.append('doors', editingCar.doors);
    formData.append('gears', editingCar.gears);
    formData.append('available', editingCar.available);

    if (editingCar.image instanceof File) {
      formData.append('image', editingCar.image);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cars/${editingCar._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedCar = await response.json();
        setCars(cars.map(car => car._id === updatedCar._id ? updatedCar : car));
        setEditingCar(null);
      } else {
        console.error('Klaida atnaujinant automobilį');
      }
    } catch (error) {
      console.error('Klaida atnaujinant automobilį:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }));
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
                      <div className="position-absolute top-0 start-0 p-2">
                        <FaInfoCircle
                          className="text-info icon"
                          size={24}
                          title="Daugiau informacijos"
                          onClick={() => handleInfoClick(car._id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      {user?.role === 'admin' && (
                        <div className="position-absolute top-0 end-0 p-2 d-flex">
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
                      <p className="card-text">Kaina: €{car.price.toFixed(2)}/diena</p>
                      <p className="card-text">
                        Pridėta: {new Date(car.createdAt).toLocaleString('lt-LT')}
                      </p>
                      <p>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {editingCar && (
            <div className="modal show">
              <div className="modal-dialog">
                <div className="modal-content border">
                  <div className="modal-header bg-dark" data-bs-theme="dark">
                    <h5 className="modal-title text-light">Redaguoti automobilį</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setEditingCar(null)}
                    ></button>
                  </div>
                  <form onSubmit={handleSaveEdit} encType="multipart/form-data">
                    <div className="modal-body">
                      <div className="mb-3">
                        <label htmlFor="image" className="form-label">Nuotrauka</label>
                        <input
                          type="file"
                          className="form-control"
                          id="image"
                          accept="image/*"
                          onChange={(e) => setEditingCar({ ...editingCar, image: e.target.files[0] })}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="model" className="form-label">Modelis</label>
                        <input
                          type="text"
                          className="form-control"
                          id="model"
                          name="model"
                          value={editingCar.model}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="capacity" className="form-label">Krepšių skaičius</label>
                        <select
                          className="form-control"
                          id="capacity"
                          name="capacity"
                          value={editingCar.capacity}
                          onChange={handleChange}
                        >
                          <option value="">Pasirinkite...</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="passengers" className="form-label">Keleivių skaičius</label>
                        <select
                          className="form-control"
                          id="passengers"
                          name="passengers"
                          value={editingCar.passengers}
                          onChange={handleChange}
                        >
                          <option value="">Pasirinkite...</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="doors" className="form-label">Durelių skaičius</label>
                        <select
                          className="form-control"
                          id="doors"
                          name="doors"
                          value={editingCar.doors}
                          onChange={handleChange}
                        >
                          <option value="">Pasirinkite...</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="gears" className="form-label">Pavarų tipas</label>
                        <select
                          className="form-control"
                          id="gears"
                          name="gears"
                          value={editingCar.gears}
                          onChange={handleChange}
                        >
                          <option value="">Pasirinkite...</option>
                          <option value="Automatinė">Automatinė</option>
                          <option value="Mechaninė">Mechaninė</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="price" className="form-label">Kaina</label>
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          name="price"
                          value={editingCar.price}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="available"
                          name="available"
                          checked={editingCar.available}
                          onChange={(e) => setEditingCar({ ...editingCar, available: e.target.checked })}
                        />
                        <label htmlFor="available" className="form-check-label">
                          Ar pasiekiamas nuomai?
                        </label>
                      </div>
                    </div>
                    <div className="modal-footer bg-dark">
                      <button type="button" className="btn btn-outline-danger" onClick={() => setEditingCar(null)}>
                        Atšaukti
                      </button>
                      <button type="submit" className="btn btn-outline-primary">
                        Išsaugoti
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarList;
