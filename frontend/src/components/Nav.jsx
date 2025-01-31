import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaClipboardList } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">
          <img src="/logo.png" alt="RENT Logo" height="50" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto d-flex align-items-center flex-column flex-sm-row my-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <div className="d-flex">
                    <Link to="/create" className="btn btn-outline-primary me-2">
                      <FaPlusCircle className="me-2 icon" /> Pridėti Automobilį
                    </Link>
                    <Link to="/reservations" className="btn btn-outline-secondary">
                      <FaClipboardList className="me-2 icon" /> Visos rezervacijos
                    </Link>
                  </div>
                )}
                {user.role === 'user' && (
                  <Link to="/my-reservations" className="btn btn-outline-primary mx-5 pb-2">
                    <FaClipboardList className="me-2 icon" /> Mano rezervacijos
                  </Link>
                )}

                <span className="navbar-text mx-3 text-white my-2">
                  {user.email}
                </span>

                <button className="btn btn-outline-danger mx-2" onClick={handleLogout}>Logout</button>
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
