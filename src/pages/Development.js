import React, { useState } from 'react';
import './Development.css';
import Introduce from './Introduce';
import { useNavigate } from 'react-router-dom';

function Development() {
    const [activeTab, setActiveTab] = useState('development'); // Active tab state
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleIntroduceClick = () => {
        navigate('/pages/introduce'); // 페이지 이동을 처리합니다.
    };

    return (
        <div className="nowairdata-container">
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'nowairdata' ? 'active' : ''}`}
                    onClick={handleIntroduceClick}
                >
                    팀소개
                </button>
                <button
                    className={`tab ${activeTab === 'development' ? 'active' : ''}`}
                    onClick={() => handleTabChange('development')}
                >
                    개발과정
                </button>
            </div>
            <div className="content">
                {activeTab === 'development' && (
                    <div>

                        <h2>개발과정</h2>

                        <h3>기획 단계:</h3>
                        <p>
                            미세먼지 예경보 사이트를 개발하기 위해 기획을 수행
                            <br></br>
                            주요 목표와 필요한 기능을 정의하고, 사용자 요구사항을 분석
                            <br></br>
                            프론트엔드와 백엔드 개발자들과 협업하여 전체적인 시스템 아키텍처를 계획</p>

                        <h3>프론트엔드 개발:</h3>
                        <img src={require('./images/react.png')} alt="React" style={{ width: '250px', height: '125px' }} />
                        <p>
                            리액트와 JavaScript를 사용하여 프론트엔드를 개발
                            <br></br>
                            개발툴로는 Visual Studio Code (VSCode)를 사용
                            <br></br>
                            사용자 인터페이스(UI)를 설계하고, 컴포넌트를 구현하여 화면을 구성
                            <br></br>
                            지역별 미세먼지 농도값의 상태를 보여주는 기능을 구현
                            <br></br>
                            API와의 통신을 처리하고, 데이터를 가공하여 화면에 표시하는 기능을 개발

                            페이지 간의 이동을 처리하기 위해 React Router를 사용.</p>

                        <h3>백엔드 개발:</h3>
                        <img src={require('./images/node.png')} alt="Node" style={{ width: '250px', height: '125px' }} />
                        <img src={require('./images/mysql.png')} alt="MySql" style={{ width: '250px', height: '125px' }} />
                        <p>
                            백엔드 개발 단계에서는 에어코리아 대기오염정보 오픈 API를 활용
                            <br></br>
                            API를 호출하여 데이터를 가져오고, 필요한 정보를 추출하고 처리
                            <br></br>
                            데이터 캐싱을 구현하여 성능을 향상
                            <br></br>
                            API 요청과 응답을 처리하는 로직을 개발
                            <br></br>
                            보안과 인증을 고려하여 API 키와 중요한 정보를 안전하게 관리
                        </p>

                    </div>
                )}
                {activeTab === 'introduce' && (
                    <div>
                        <Introduce />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Development;