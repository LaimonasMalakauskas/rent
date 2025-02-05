import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CarForm = () => {
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [capacity, setCapacity] = useState('');
  const [passengers, setPassengers] = useState('');
  const [doors, setDoors] = useState('');
  const [gears, setGears] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!model || price <= 0) {
      setError('Modelis ir kaina yra privalomi');
      return;
    }

    const formData = new FormData();
    formData.append('model', model);
    formData.append('price', price);
    formData.append('available', available);
    formData.append('capacity', capacity);
    formData.append('passengers', passengers);
    formData.append('doors', doors);
    formData.append('gears', gears);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newCar = await response.json();
        console.log('Gauta nauja mašina:', newCar);
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Įvyko klaida, bandykite vėliau');
      }
    } catch (error) {
      setError('Tinklo klaida, bandykite vėliau');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h2 className="mb-4">Pridėti Automobilį</h2>
      <form onSubmit={handleSubmit} className="w-50 border border-light rounded-3 p-3 bg-dark bg-gradient text-light mb-5" encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Nuotrauka:</label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="model" className="form-label">Modelis:</label>
          <input
            type="text"
            id="model"
            className="form-control"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">Krepšių skaičius:</label>
          <select
            id="capacity"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          >
            <option value="">Pasirinkite...</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="passengers" className="form-label">Keleivių skaičius:</label>
          <select
            id="passengers"
            className="form-control"
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            required
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
          <label htmlFor="doors" className="form-label">Durelių skaičius:</label>
          <select
            id="doors"
            className="form-control"
            value={doors}
            onChange={(e) => setDoors(e.target.value)}
            required
          >
            <option value="">Pasirinkite...</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="gears" className="form-label">Pavarų tipas:</label>
          <select
            id="gears"
            className="form-control"
            value={gears}
            onChange={(e) => setGears(e.target.value)}
            required
          >
            <option value="">Pasirinkite...</option>
            <option value="Automatinė">Automatinė</option>
            <option value="Mechaninė">Mechaninė</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Kaina:</label>
          <input
            type="number"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="available"
            className="form-check-input"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          <label htmlFor="available" className="form-check-label">
            Ar pasiekiamas nuomai?
          </label>
        </div>

        {error && <p className="text-danger">{error}</p>}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-outline-primary">Pridėti</button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
