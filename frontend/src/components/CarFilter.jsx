import React from 'react';

const CarFilter = ({ filter, setFilter }) => {
  return (
    <div className="mb-3">
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
  );
};

export default CarFilter;
