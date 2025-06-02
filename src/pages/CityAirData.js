import React, { useState, useEffect } from 'react';
import './CityAirData.css';

function CityAirData() {
  const [activeTab, setActiveTab] = useState('citydatapm1'); 
  const [data, setData] = useState([]); 
  const [date, setDate] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const cityNames = [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '세종',
    '경북',
    '경남',
    '제주',
  ];

  useEffect(() => {
    fetch('/api/cityAirdata')
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  });

  useEffect(() => {
    fetch('/api/cityair')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setDate(data[0].dataTime);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  });

  //pm2.5
  const getAverage25 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName);
    const values = filteredData
      .map((item) => item.pm25Value)
      .filter(value => value !== null && !isNaN(value));
    const sum = values.reduce((acc, value) => acc + parseFloat(value), 0);
    const average = sum / values.length;
    return isNaN(average) ? '-' : average.toFixed(0);
  };

  const getMaxValue25 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName);
    const values = filteredData
      .map((item) => item.pm25Value)
      .filter(value => value !== null && !isNaN(value));
    const maxValue = Math.max(...values);
    return isNaN(maxValue) ? '-' : maxValue.toFixed(0);
  };

  const getMinValue25 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName);
    const values = filteredData
      .map((item) => item.pm25Value)
      .filter(value => value !== null && !isNaN(value));
    const minValue = Math.min(...values);
    return isNaN(minValue) ? '-' : minValue.toFixed(0);
  };

  //pm10
  const getAverage10 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName);
    const values = filteredData
      .map((item) => item.pm10Value)
      .filter(value => value !== null && !isNaN(value));
    const sum = values.reduce((acc, value) => acc + parseFloat(value), 0);
    const average = sum / values.length;
    return isNaN(average) ? '-' : average.toFixed(0);
  };
  
  
  const getMaxValue10 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName && item.pm10Value !== null);
    const values = filteredData
      .map((item) => item.pm10Value)
      .filter(value => value !== null && !isNaN(value));
    const maxValue = Math.max(...values);
    return isNaN(maxValue) ? '-' : maxValue.toFixed(0);
  };
  
  const getMinValue10 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName && item.pm10Value !== null);
    const values = filteredData
      .map((item) => item.pm10Value)
      .filter(value => value !== null && !isNaN(value));
    const minValue = Math.min(...values);
    return isNaN(minValue) ? '-' : minValue.toFixed(0);
  };  

  //O3
  const getAverageo3 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName);
    const values = filteredData
      .map((item) => item.o3Value)
      .filter(value => value !== null && !isNaN(value));
    const sum = values.reduce((acc, value) => acc + parseFloat(value), 0);
    const average = sum / values.length;
    return isNaN(average) ? '-' : average.toFixed(3);
  };
  
  
  const getMaxValueo3 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName);
    const values = filteredData
      .map((item) => item.o3Value)
      .filter(value => value !== null && !isNaN(value));
    const maxValue = Math.max(...values);
    return isNaN(maxValue) ? '-' : maxValue.toFixed(3);
  };
  
  const getMinValueo3 = (cityName) => {
    const filteredData = data.filter((item) => item.sidoName === cityName);
    const values = filteredData
      .map((item) => item.o3Value)
      .filter(value => value !== null && !isNaN(value));
    const minValue = Math.min(...values);
    return isNaN(minValue) ? '-' : minValue.toFixed(3);
  };
  
  return (
    <div className="nowairdata-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'citydatapm1' ? 'active' : ''}`}
          onClick={() => handleTabChange('citydatapm1')}
        >
          시도별대기정보  (PM-2.5)
        </button>
        <button
          className={`tab ${activeTab === 'citydatapm2' ? 'active' : ''}`}
          onClick={() => handleTabChange('citydatapm2')}
        >
          시도별대기정보(PM-10)
        </button>
        <button
          className={`tab ${activeTab === 'citydataozone' ? 'active' : ''}`}
          onClick={() => handleTabChange('citydataozone')}
        >
          시도별대기정보(오존)
        </button>
      </div>
      <div className="content">
        {activeTab === 'citydatapm1' && (
          <div>
            <h2>시도별대기정보(PM-2.5)</h2>
            <p>{date}기준</p>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>도시</th>
                  {cityNames.map((cityName) => (
                    <th key={cityName}>{cityName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>일평균</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getAverage25(cityName)}</td>
                  ))}
                </tr>
                <tr>
                  <th>최고값</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getMaxValue25(cityName)}</td>
                  ))}
                </tr>
                <tr>
                  <th>최저값</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getMinValue25(cityName)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'citydatapm2' && (
          <div>
            <h2>시도별대기정보(PM-10)</h2>
            <p>{date}기준</p>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>도시</th>
                  {cityNames.map((cityName) => (
                    <th key={cityName}>{cityName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>일평균</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getAverage10(cityName)}</td>
                  ))}
                </tr>
                <tr>
                  <th>최고값</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getMaxValue10(cityName)}</td>
                  ))}
                </tr>
                <tr>
                  <th>최저값</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getMinValue10(cityName)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'citydataozone' && (
          <div>
            <h2>시도별대기정보(오존)</h2>
            <p>{date}기준</p>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>도시</th>
                  {cityNames.map((cityName) => (
                    <th key={cityName}>{cityName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>일평균</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getAverageo3(cityName)}</td>
                  ))}
                </tr>
                <tr>
                  <th>최고값</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getMaxValueo3(cityName)}</td>
                  ))}
                </tr>
                <tr>
                  <th>최저값</th>
                  {cityNames.map((cityName) => (
                    <td key={cityName}>{getMinValueo3(cityName)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CityAirData;