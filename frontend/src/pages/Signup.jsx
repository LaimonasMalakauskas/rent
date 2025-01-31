import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Prašome užpildyti visus laukus');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        const user = { email };
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);

        navigate('/');
        alert('Registracija sėkminga');
      } else {
        const data = await response.json();
        setError(data.message || 'Įvyko klaida');
      }
    } catch (err) {
      setError('Tinklo klaida');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mt-4 text-center">Registracija</h2>
      <div className="col-md-6 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">El. paštas</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="El. paštas"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Slaptažodis</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Slaptažodis"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-primary border-3">Registruotis</button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  ); 
};

export default Register;
