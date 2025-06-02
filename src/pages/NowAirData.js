import React, { useState, useEffect } from 'react';
import './NowAirData.css';

function NowAirData() {
  const [activeTab, setActiveTab] = useState(''); // Active tab state
  const [dataList, setDataList] = useState([]); // Data list state
  const [stationName, setStationName] = useState('');
  const [a, setA] = useState('');

  // useEffect(() => {
  //   // 측정자료 조회 탭이 선택될 때마다 데이터를 가져오는 함수
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`/api/airdata?stationName=${stationName}`);
  //       const data = await response.json();
  //       if (data.message) {
  //         console.log(data.message); // 처리할 메시지가 있다면 콘솔에 출력
  //       } else {
  //         setDataList(data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   // if (activeTab === 'dataSearch') {
  //     fetchData();
  //   // }
  // }, [activeTab, stationName]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStationName('');
  };

  const handleSearchClick = () => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/airdata?stationName=${stationName}`);
        const data = await response.json();
        if (data.message) {
          console.log(data.message); // 처리할 메시지가 있다면 콘솔에 출력
        } else {
          setDataList(data);
          setA(data[0].stationName);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (activeTab === 'dataSearch') {
      fetchData();
    }
  };

  return (
    <div className="nowairdata-container">
      <div className="content">
        <label>
          측정소:
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
          />
          <button className="search-button" onClick={handleSearchClick}>
            검색
          </button>
        </label>
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'dataSearch' ? 'active' : ''}`}
            onClick={() => handleTabChange('dataSearch')}
          >
            측정자료 조회
          </button>
          <button
            className={`tab-button ${activeTab === 'integratedAirQuality' ? 'active' : ''}`}
            onClick={() => handleTabChange('integratedAirQuality')}
          >
            통합대기 환경지수 조회
          </button>
        </div>

        {activeTab === 'dataSearch' && (
          <div>
            <h2>측정자료 조회</h2>
            <p>{a}</p>
            <table className="nowairdata-table">
              <thead>
                <tr>
                  <th>날짜 및 시간</th>
                  <th>미세먼지 (㎍/㎥)<br />1시간</th>
                  <th>초미세먼지 (㎍/㎥)<br />1시간</th>
                  <th>오존 (ppm)<br />1시간</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(dataList) &&
                  dataList.length > 0 &&
                  dataList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.dataTime}</td>
                      <td>{item.pm10Value}</td>
                      <td>{item.pm25Value}</td>
                      <td>{item.o3Value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'integratedAirQuality' && (
          <div>
            <h2>통합대기 환경지수 조회</h2>
            <p>{a}</p>
            <table className="nowairdata-table">
              <thead>
                <tr>
                  <th>날짜 및 시간</th>
                  <th>미세먼지 (㎍/㎥)<br />24시간</th>
                  <th>초미세먼지 (㎍/㎥)<br />24시간</th>
                  <th>오존 (ppm)<br />1시간</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(dataList) &&
                  dataList.length > 0 &&
                  dataList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.dataTime}</td>
                      <td>{item.pm10Value24}</td>
                      <td>{item.pm25Value24}</td>
                      <td>{item.o3Value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default NowAirData;
