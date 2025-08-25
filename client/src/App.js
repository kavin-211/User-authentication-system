import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import UserModule from './components/UserModule';
import Navbar from './components/Navbar';
import './App.css';

const PrivateRoute = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/" />;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserModule /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
