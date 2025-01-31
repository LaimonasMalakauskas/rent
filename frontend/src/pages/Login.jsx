import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
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

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('user', JSON.stringify(data.user));  
        
        setUser(data.user);
        
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Prisijungimo klaida');
      }
    } catch (error) {
      setError('Įvyko klaida, bandykite vėliau');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mt-4 text-center">Prisijungti</h2>
      <div className="col-md-6 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">El. paštas:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Slaptažodis:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-primary border-3">Prisijungti</button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  ); 
};

export default Login;
