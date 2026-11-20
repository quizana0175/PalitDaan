import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PalitDaan from './layouts/PalitDaan';
import './css/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<PalitDaan />} />
      </Routes>
    </BrowserRouter>
  );
}
