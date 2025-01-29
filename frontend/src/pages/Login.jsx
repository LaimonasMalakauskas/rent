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

    const user = { email }; 

    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    navigate('/'); 
  };

  return (
    <div className="container">
      <h2 className="mt-4">Prisijungti</h2>
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
        <button type="submit" className="btn btn-primary">Prisijungti</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
};

export default Login;
