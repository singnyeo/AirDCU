import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Introduce from './pages/Introduce';
import Development from './pages/Development';
import NowAirData from './pages/NowAirData';
import CityAirData from './pages/CityAirData';
import AirData from './pages/AirData';
import WeekAirData from './pages/WeekAirData';
import Dictionary from './pages/Dictionary';
import logo from './pages/images/logo.png';
import './App.css';
import Home from './pages/Home';

function Logo() {
  return <img src={logo} alt="Logo" className="logo" />;
}

function App() {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  // const [searchQuery, setSearchQuery] = useState('');

  const handleMenuEnter = (index) => {
    setActiveMenuIndex(index);
    document.body.style.cursor = 'pointer';
  };

  const handleMenuLeave = () => {
    setActiveMenuIndex(null);
    document.body.style.cursor = 'auto';
  };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   // TODO: Handle search query
  //   console.log('Search Query:', searchQuery);
  // };

  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              <Logo />
            </Link>
            <ul className="navbar-menu">
              <li
                className={`navbar-item ${activeMenuIndex === 0 ? 'active' : ''}`}
                onMouseEnter={() => handleMenuEnter(0)}
                onMouseLeave={handleMenuLeave}
              >
                <Link to="/pages/introduce" className="navbar-link">소개</Link>
                {activeMenuIndex === 0 && (
                  <ul className="submenu">
                    <Link to="/pages/introduce">팀소개</Link>
                    <br></br>
                    <Link to="/pages/development">개발과정</Link>
                  </ul>
                )}
              </li>
              <li
                className={`navbar-item ${activeMenuIndex === 1 ? 'active' : ''}`}
                onMouseEnter={() => handleMenuEnter(1)}
                onMouseLeave={handleMenuLeave}
              >
                <Link to="/pages/nowairdata" className="navbar-link">실시간자료조회</Link>
                {activeMenuIndex === 1 && (
                  <ul className="submenu">
                    <Link to="/pages/nowairdata">실시간 대기정보</Link>
                    <br></br>
                    <Link to="/pages/cityairdata">시도별 대기정보</Link>
                  </ul>
                )}
              </li>
              <li
                className={`navbar-item ${activeMenuIndex === 2 ? 'active' : ''}`}
                onMouseEnter={() => handleMenuEnter(2)}
                onMouseLeave={handleMenuLeave}
              >
                <Link to="/pages/airdata" className="navbar-link">대기정보예보/경보</Link>
                {activeMenuIndex === 2 && (
                  <ul className="submenu">
                    <Link to="/pages/airdata">오늘/내일 대기정보</Link>
                    <br></br>
                    <Link to="/pages/weekairdata">초미세먼지 주간정보</Link>
                  </ul>
                )}
              </li>
              <li
                className={`navbar-item ${activeMenuIndex === 3 ? 'active' : ''}`}
                onMouseEnter={() => handleMenuEnter(3)}
                onMouseLeave={handleMenuLeave}
              >
                <Link to="/pages/dictionary" className="navbar-link">알림마당</Link>
                {activeMenuIndex === 3 && (
                  <ul className="submenu">
                    <Link to="/pages/dictionary">용어사전</Link>
                  </ul>
                )}
              </li>
              {/* <li className="navbar-item">
                <Link to="/pages/map" className="navbar-link">Map</Link>
              </li> */}
            </ul>
          </div>
        </nav>
        <div className="content">
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/pages/introduce" element={<Introduce />} />
          <Route path="/pages/nowairdata" element={<NowAirData />} />
          <Route path="/pages/airdata" element={<AirData />} />
          <Route path="/pages/dictionary" element={<Dictionary />} />
          <Route path="/pages/development" element={<Development />} />
          <Route path="/pages/cityairdata" element={<CityAirData />} />
          <Route path="/pages/weekairdata" element={<WeekAirData />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;