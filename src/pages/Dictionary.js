import React from "react";
import "./Dictionary.css";
import image1 from "./images/table/avatar.png";
import image2 from "./images/table/bus.png";
import image3 from "./images/table/hiking.png";
import image4 from "./images/table/school.png";
import image5 from "./images/table/wash-face.png";
import image6 from "./images/table/washing-machine.png";
import image7 from "./images/table/basketball.png";
import image8 from "./images/table/soccer.png";
import image9 from "./images/table/teaching.png";
import image10 from "./images/table/subway.png";
import image11 from "./images/table/car.png";
import image12 from "./images/table/fire.png";

function Dictionary() {
  return (
    <div>
      <h2>예보등급 및 행동요령</h2>

      {/* 예보등급및행동요령table시작 */}
      <table className="guide-table">
        <tr>
          <th colSpan={6}>예보등급 및 행동요령</th>
        </tr>
        <tr>
          <th rowSpan={2} colSpan={2}>
            예보구간
          </th>
          <th colSpan={4}>등급</th>
        </tr>
        <tr>
          <td className="cell-blue">
            <strong>좋음</strong>
          </td>
          <td className="cell-green">
            <strong>보통</strong>
          </td>
          <td className="cell-yellow">
            <strong>나쁨</strong>
          </td>
          <td className="cell-red">
            <strong>매우나쁨</strong>
          </td>
        </tr>
        <tr>
          <th rowSpan={2}>예측농도(㎍/㎥,1일)</th>
          <th> PM-10 </th>
          <th>0~30</th>
          <th>31~80</th>
          <th>81~150</th>
          <th>151 이상</th>
        </tr>
        <tr>
          <th> PM-2.5 </th>
          <th>0~15</th>
          <th>16~35</th>
          <th>36~75</th>
          <th>76 이상</th>
        </tr>
        <tr>
          <th>예측농도(ppm, 1시간)</th>
          <th>
            O<sub>3</sub>
          </th>
          <th>0~0.030</th>
          <th>0.031~0.090</th>
          <th>0.091~0.150</th>
          <th>0.151이상</th>
        </tr>
        <tr>
          <th rowSpan={2}>행동요령(미세먼지)</th>
          <th> 민감군 </th>
          <th></th>
          <th>
            외출시 특별한 행동에 제약은 없으나 몸 상태에 따라 유의하여 활동한다
          </th>
          <th>
            장시간 또는 무리한 실외 활동 제한하고, 특히 천식환자는 실외활동 시
            흡입기를 더 자주 사용한다
          </th>
          <th>가급적 실내활동만 하고 실외 활동 시 의사와 상의하여 활동한다</th>
        </tr>
        <tr>
          <th> 일반인 </th>
          <th></th>
          <th></th>
          <th>
            장시간 또는 무리한 실외 활동을 제한하고, 특히 눈이 아프거나,
            기침이나 목의 통증으로 불편한 사람은 실내 활동으로 제한한다
          </th>
          <th>
            장시간 또는 무리한 실외 활동 제한하고, 기침이나 목의 통증 등이 있는
            사람은 실내 활동으로 제한한다
          </th>
        </tr>
        <tr>
          <th rowSpan={2}>행동요령(오존)</th>
          <th> 민감군 </th>
          <th></th>
          <th>
            실외활동시 특별한 행동에 제약은 없으나 몸 상태에 따라 유의하여
            활동한다
          </th>
          <th>장시간 또는 무리한 실외 활동을 제한한다</th>
          <th>가급적 실내활동을 한다</th>
        </tr>
        <tr>
          <th> 일반인 </th>
          <th></th>
          <th></th>
          <th>
            장시간 또는 무리한 실외 활동을 제한하고, 특히 눈이 아픈 사람은
            실내활동을 권장한다
          </th>
          <th>실외활동을 제한하고, 실내에서 생활하도록 권고한다</th>
        </tr>
      </table>
      <h5>※ 민감군 : 어린이, 노인, 천식같은 폐질환 또는 심장질환자</h5>
      <br />
      <br />
      {/* 예보등급및행동요령table끝 */}
      {/* 건강생활수칙table시작 */}

      <h2>건강 생활 수칙</h2>
      <table className="health-guide">
        <tr>
          <th colSpan={4}>건강 생활 수칙</th>
        </tr>
        <tr>
          <th colSpan={4}>참고:미세먼지 높은 날 건강 생활 수칙</th>
        </tr>
        <tr>
          <td>
            <img src={image3} alt="./images/table/hiking.png" />
          </td>
          <th>
            등산, 축구, 등 오랜 실외 활동을 자제하고, 특히 어린이, 노약자,
            호흡기 및 심폐질환자는 가급적 실외활동 자제
          </th>
          <td>
            <img src={image4} alt="./images/table/school.png" />
          </td>
          <th>학교나 유치원에서는 체육활동 시 실내수업으로 대체 권고</th>
        </tr>
        <tr>
          <td>
            <img src={image1} alt="./images/table/avatar.png" />