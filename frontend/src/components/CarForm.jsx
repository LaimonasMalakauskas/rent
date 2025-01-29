import React, { useState } from 'react';

const CarForm = ({ setCars }) => {
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!model || price <= 0) {
      setError('Modelis ir kaina yra privalomi');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, price, available }),
      });

      if (response.ok) {
        const newCar = await response.json();
        setCars((prevCars) => [newCar, ...prevCars]);
        setModel('');
        setPrice('');
        setAvailable(true);
        setError('');
        alert('Automobilis buvo sėkmingai įrašytas!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Įvyko klaida, bandykite vėliau');
      }
    } catch (error) {
      setError('Tinklo klaida, bandykite vėliau');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Pridėti Automobilį</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="btn btn-primary">Pridėti Automobilį</button>
      </form>

      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default CarForm;
