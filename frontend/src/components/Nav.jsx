import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">RENT</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-3 text-white">
                  {user.email}
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-outline-warning me-2 mt-2">Pridėti Automobilį</Link>
                )}
                <button className="btn btn-outline-danger me-2 mt-2" onClick={onLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-warning me-2 mt-2">Login</Link>
                <Link to="/signup" className="btn btn-outline-warning me-2 mt-2">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
