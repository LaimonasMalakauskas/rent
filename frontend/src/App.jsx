import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import DetailedInfoPage from './pages/DetailedInfoPage';
import MyReservationsPage from './pages/MyReservationsPage';
import AllReservedCars from './pages/AllReservedCars';

const App = ({ user, onLogout, setUser }) => {
  return (
    <div className="wrapper">
      <Navbar user={user} onLogout={onLogout} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          {user && user.role === 'admin' && (
            <Route path="/create" element={<AdminPage />} />
          )}
          <Route path='/info/:id' element={<DetailedInfoPage user={user} />} />
          <Route path="/my-reservations" element={<MyReservationsPage user={user} />} />
          <Route path='/reservations' element={<AllReservedCars />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
