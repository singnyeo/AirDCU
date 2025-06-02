import React, { useState } from 'react';
import './Introduce.css';
import Development from './Development';
import { useNavigate } from 'react-router-dom';

function Introduce() {
  const [activeTab, setActiveTab] = useState('introduce'); // Active tab state
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDevelopmentClick = () => {
    navigate('/pages/development'); // 페이지 이동을 처리합니다.
  };

  return (
    <div className="nowairdata-container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'introduce' ? 'active' : ''}`}
          onClick={() => handleTabChange('introduce')}
        >
          팀소개
        </button>
        <button
          className={`tab ${activeTab === 'development' ? 'active' : ''}`}
          onClick={handleDevelopmentClick}
        >
          개발과정
        </button>
      </div>
      <div className="content">
        {activeTab === 'introduce' && (
          <div>

            <h2>팀소개</h2>
            <h3>팀명: &&*(Shift 778)</h3>
            - 별을 바라보는 사람의 모습

            <h3>팀원:</h3>
            - 조형빈 (팀장)
            <br></br>
            - 하예진
            <br></br>
            - 정재필
            <br></br>
            - 강시연
            <br></br>
            - 이상민

            <h3>프론트엔드 담당:</h3>
            - 하예진
            <br></br>
            - 정재필

            <h3>백엔드 담당:</h3>
            - 조형빈
            <br></br>
            - 강시연
            <br></br>
            - 이상민
          </div>
        )}
        {activeTab === 'development' && (
          <div>
            <Development />
          </div>
        )}
      </div>
    </div>
  );
}

export default Introduce;