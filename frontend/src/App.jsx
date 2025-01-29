import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import HomePage from './pages/HomePage';

const App = ({ user, onLogout, setUser }) => {
  return (
    <div className="wrapper">
      <Navbar user={user} onLogout={onLogout} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
