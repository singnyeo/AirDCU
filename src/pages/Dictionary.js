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
          <th>좋음</th>
          <th>보통</th>
          <th>나쁨</th>
          <th>매우나쁨</th>
        </tr>
        <tr>
          <th rowSpan={2}>예측농도(㎍/㎥,1일)</th>
          <th>PM-10</th>
          <th>0~30</th>
          <th>31~80</th>
          <th>81~150</th>
          <th>151 이상</th>
        </tr>
        <tr>
          <th>PM-2.5</th>
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
          <th>민감군</th>
          <th></th>
          <th>
            실외활동 시 특별히 행동에 제약은 없으나 몸 상태에 따라 유의하여 활동
          </th>
          <th>
            장시간 또는 무리한 실외 활동 제한, 특히 천식환자는 실외활동 시
            흡입기를 더 자주 사용할 필요가 있음
          </th>
          <th>가급적 실내활동만 하고 실외 활동 시 의사와 상의</th>
        </tr>
        <tr>
          <th>일반인</th>
          <th></th>
          <th></th>
          <th>
            장시간 또는 무리한 실외 활동 제한, 특히 눈이 아프거나, 기침이나 목의
            통증으로 불편한 사람은 실외 활동으로 피해야 함
          </th>
          <th>
            장시간 또는 무리한 실외 활동 제한, 기침이나 목의 통증 등이 있는
            사람은 실외활동을 피해야 함
          </th>
        </tr>
        <tr>
          <th rowSpan={2}>행동요령(오존)</th>
          <th>민감군</th>
          <th></th>
          <th>
            실외 활동 시 특별히 행동에 제약을 받을 필요는 없지만몸 상태에 따라
            유의하여 활동
          </th>
          <th>장시간 또는 무리한 실외활동 제한</th>
          <th>가급적 실내활동</th>
        </tr>
        <tr>
          <th>일반인</th>
          <th></th>
          <th></th>
          <th>
            장시간 또는 무리한 실외활동 제한 특히 눈이 아픈 사람은 실외활동을
            피해야 함
          </th>
          <th>실외활동을 제한하고 실내생활 권고</th>
        </tr>
        <h5>※ 민감군 : 어린이, 노인, 천식같은 폐질환 또는 심장질환자</h5>
      </table>
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
          </td>
          <th>실외활동 시에는 마스크, 보호안경, 모자 등 착용</th>
          <td>
            <img src={image6} alt="./images/table/washing-machine.png" />
          </td>
          <th>창문을 닫고, 빨래는 실내에서 건조</th>
        </tr>
        <tr>
          <td>
            <img src={image5} alt="./images/table/wash-face.png" />
          </td>
          <th>세면을 자주하고, 흐르는 물에 코를 자주 세척</th>
          <td>
            <img src={image2} alt="./images/table/bus.png" />
          </td>
          <th>가급적 대중교통을 이용하고, 야외 바비큐 등 자제</th>
        </tr>
        <tr>
          <th colSpan={4}>참고 : 오존 높은 날 건강 생활 수칙</th>
        </tr>
        <tr>
          <td>
            <img src={image7} alt="./images/table/basketball.png" />
          </td>
          <th>주민 실외활동 및 과격운동 자제</th>
          <td>
            <img src={image8} alt="./images/table/soccer.png" />
          </td>
          <th>어린이, 노약자, 호흡기 환자, 심장질환자의 실외활동 자제</th>
        </tr>
        <tr>
          <td>
            <img src={image9} alt="./images/table/teaching.png" />
          </td>
          <th>학교나 유치원에서는 실외수업 자제</th>
          <td>
            <img src={image10} alt="./images/table/subway.png" />
          </td>
          <th>자가용 사용을 자제하고 대중교통 이용</th>
        </tr>
        <tr>
          <td>
            <img src={image11} alt="./images/table/car.png" />
          </td>
          <th>
            자동차 운행, 스프레이 사용, 드라이크리닝, 페인트칠, 시너 사용 억제
          </th>
          <td>
            <img src={image12} alt="./images/table/fire.png" />
          </td>
          <th>노천 소각 금지</th>
        </tr>
      </table>
      {/* 건강생활수칙table 끝 */}
    </div>
  );
}

export default Dictionary;