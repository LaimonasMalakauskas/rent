import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CarForm = () => {
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(null);
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
      <form onSubmit={handleSubmit} className="w-50" encType="multipart/form-data">
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
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Pridėti</button>
      </form>
    </div>
  );
};

export default CarForm;
