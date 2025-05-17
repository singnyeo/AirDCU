import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Introduce from './Introduce';
import NowAirData from './NowAirData';
import AirData from './AirData';
import Dictionary from './Dictionary';

import { BrowserRouter, Route, Routes } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
      <BrowserRouter>
        <Routes>
          <Route path="/introduce" element={<Introduce />} />
          <Route path="/nowairdata" element={<NowAirData />} />
          <Route path="/airdata" element={<AirData />} />
          <Route path="/dictionary" element={<Dictionary />} />
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
