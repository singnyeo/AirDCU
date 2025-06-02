import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WeekAirData.css';

const WeekAirData = () => {
    const [data, setData] = useState([]);
    const [selectedButton, setSelectedButton] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/weekForecast');
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleButtonClick = (buttonType) => {
        setSelectedButton(buttonType);
        if (buttonType === 'airdata') {
            navigate('/pages/airdata');
        } else if (buttonType === 'weekairdata') {
            navigate('/pages/weekairdata');
        }
    };

    return (
        <div className="weekairdata-container">
            {/* <div className="button-container">
                <button
                    className={selectedButton === 'airdata' ? 'active' : ''}
                    onClick={() => handleButtonClick('airdata')}
                >
                    오늘/내일 대기정보
                </button>
                <button
                    className={selectedButton === 'weekairdata' ? 'active' : ''}
                    onClick={() => handleButtonClick('weekairdata')}
                >
                    초미세먼지 주간정보
                </button>
            </div> */}
            <h1>초미세먼지 농도 예보 등급 표</h1>
            <table className="air-data-table">
                <thead>
                    <tr>
                        <th rowSpan="2">요일</th>
                        <th colSpan="4">경기권</th>
                        <th colSpan="2">강원권</th>
                        <th colSpan="4">충청권</th>
                        <th colSpan="3">전라권</th>
                        <th colSpan="5">경상권</th>
                        <th rowSpan="1">제주권</th>
                        <th rowSpan="2">신뢰도</th>
                    </tr>
                    <tr>
                        <th>서울</th>
                        <th>인천</th>
                        <th>경기북부</th>
                        <th>경기남부</th>
                        <th>강원영서</th>
                        <th>강원영동</th>
                        <th>대전</th>
                        <th>세종</th>
                        <th>충북</th>
                        <th>충남</th>
                        <th>광주</th>
                        <th>전북</th>
                        <th>전남</th>
                        <th>부산</th>
                        <th>대구</th>
                        <th>울산</th>
                        <th>경북</th>
                        <th>경남</th>
                        <th>제주</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 하나 */}
                    {data.map((item, index) => {
                        const cityData = item.frcstOneCn.split(',').map((data) => data.split(':')[1].trim());
                        return (
                            <tr key={index}>
                                <td>{item.frcstOneDt}</td>
                                {cityData.map((city, cityIndex) => (
                                    <td key={cityIndex}>{city}</td>
                                ))}
                            </tr>
                        );
                    })}
                    {/* 둘 */}
                    {data.map((item, index) => {
                        const cityData = item.frcstTwoCn.split(',').map((data) => data.split(':')[1].trim());
                        return (
                            <tr key={index}>
                                <td>{item.frcstTwoDt}</td>
                                {cityData.map((city, cityIndex) => (
                                    <td key={cityIndex}>{city}</td>
                                ))}
                            </tr>
                        );
                    })}
                    {/* 셋 */}
                    {data.map((item, index) => {
                        const cityData = item.frcstThreeCn.split(',').map((data) => data.split(':')[1].trim());
                        return (
                            <tr key={index}>
                                <td>{item.frcstThreeDt}</td>
                                {cityData.map((city, cityIndex) => (
                                    <td key={cityIndex}>{city}</td>
                                ))}
                            </tr>
                        );
                    })}
                    {/* 넷 */}
                    {data.map((item, index) => {
                        const cityData = item.frcstFourCn.split(',').map((data) => data.split(':')[1].trim());
                        return (
                            <tr key={index}>
                                <td>{item.frcstFourDt}</td>
                                {cityData.map((city, cityIndex) => (
                                    <td key={cityIndex}>{city}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default WeekAirData;
