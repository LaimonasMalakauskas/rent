import React from 'react';

const CarFilter = ({
  filter,
  setFilter,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  models,
  selectedModel,
  setSelectedModel, 
}) => {
  return (
    <div className="row mb-3 d-flex align-items-center">
      <div className="col-2 md-3 mb-3">
        <label htmlFor="filter" className="form-label">Filtruoti pagal:</label>
        <select
          id="filter"
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Visi</option>
          <option value="available">Pasiekiami</option>
          <option value="unavailable">Nepasiekiami</option>
        </select>
      </div>
      <div className="col-2 md-3 mb-3">
        <label htmlFor="minPrice" className="form-label">Minimali kaina:</label>
        <input
          type="number"
          id="minPrice"
          className="form-control"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min. kaina"
        />
      </div>
      <div className="col-2 md-3 mb-3">
        <label htmlFor="maxPrice" className="form-label">Maksimali kaina:</label>
        <input
          type="number"
          id="maxPrice"
          className="form-control"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max. kaina"
        />
      </div>
      <div className="col-2 md-3 mb-3">
        <label htmlFor="modelFilter" className="form-label">Filtruoti pagal modelį:</label>
        <select
          id="modelFilter"
          className="form-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="all">Visi modeliai</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CarFilter;
