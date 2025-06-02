import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AirData.css";

function AirData() {
  const [isLoading, setIsLoading] = useState(true);
  const [pm10Url, setPm10Url] = useState("");
  const [pm25Url, setPm25Url] = useState("");
  const [o3Url, setO3Url] = useState("");
  //오늘 데이터 저장
  const [pm10InformGrade, setPm10InformGrade] = useState([]);
  const [pm25InformGrade, setPm25InformGrade] = useState([]);
  const [o3InformGrade, setO3InformGrade] = useState([]);
  const [airOverall, setAirOverall] = useState("");
  const [airCause, setAirCause] = useState("");
  const [o3Overall, setO3Overall] = useState("");
  const [o3Cause, setO3Cause] = useState("");
  const [airDate, setAirDate] = useState("");
  const [o3Date, setO3Date] = useState("");

  //내일 데이터 저장
  const [tmpm10InformGrade, setTmPm10InformGrade] = useState([]);
  const [tmpm25InformGrade, setTmPm25InformGrade] = useState([]);
  const [tmo3InformGrade, setTmO3InformGrade] = useState([]);
  const [tmairOverall, setTmAirOverall] = useState("");
  const [tmairCause, setTmAirCause] = useState("");
  const [tmo3Overall, setTmO3Overall] = useState("");
  const [tmo3Cause, setTmO3Cause] = useState("");
  const [tmairDate, setTmAirDate] = useState("");
  const [tmo3Date, setTmO3Date] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/air");
        const { items } = response.data.response.body;

        setIsLoading(false);
        setPm10Url(items[0].imageUrl7);
        setPm25Url(items[2].imageUrl8);
        setO3Url(items[4].imageUrl9);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pm10Response, pm25Response, o3Response] = await Promise.all([
          axios.get("/api/forecast/pm10"),
          axios.get("/api/forecast/pm25"),
          axios.get("/api/forecast/o3"),
        ]);
        //오늘 데이터 저장(pm10)
        const airInformOverall = pm10Response.data.firstValue.informOverall;
        const airInformCause = pm10Response.data.firstValue.informCause;
        const airDate = pm10Response.data.firstValue.informData;
        setAirOverall(airInformOverall);
        setAirCause(airInformCause);
        setAirDate(airDate);
        const pm10InformGrade = pm10Response.data.firstValue.informGrade;
        const pm10InformGradeArray = pm10InformGrade.split(",");
        const pm10InformGradeMap = pm10InformGradeArray.reduce((map, item) => {
          const [city, grade] = item.split(":");
          map[city.trim()] = grade.trim();
          return map;
        }, []);
        const orderedPm10InformGrade = todayData.map(
          (data) => pm10InformGradeMap[data.city]
        );
        setPm10InformGrade(orderedPm10InformGrade);

        //내일 데이터 저장 (pm10)
        const tmairInformOverall = pm10Response.data.sixthValue.informOverall;
        const tmairInformCause = pm10Response.data.sixthValue.informCause;
        const tmairDate = pm10Response.data.sixthValue.informData;
        setTmAirOverall(tmairInformOverall);
        setTmAirCause(tmairInformCause);
        setTmAirDate(tmairDate); 
        const tmpm10InformGrade = pm10Response.data.sixthValue.informGrade;
        const tmpm10InformGradeArray = tmpm10InformGrade.split(",");
        const tmpm10InformGradeMap = tmpm10InformGradeArray.reduce(
          (map, item) => {
            const [city, grade] = item.split(":");
            map[city.trim()] = grade.trim();
            return map;
          },
          []
        );
        const tmorderedPm10InformGrade = todayData.map(
          (data) => tmpm10InformGradeMap[data.city]
        );
        setTmPm10InformGrade(tmorderedPm10InformGrade);

        //오늘 데이터 저장(pm25)
        const pm25InformGrade = pm25Response.data.secondValue.informGrade;
        const pm25InformGradeArray = pm25InformGrade.split(",");
        const pm25InformGradeMap = pm25InformGradeArray.reduce((map, item) => {
          const [city, grade] = item.split(":");
          map[city.trim()] = grade.trim();
          return map;
        }, []);
        const orderedPm25InformGrade = todayData.map(
          (data) => pm25InformGradeMap[data.city]
        );
        setPm25InformGrade(orderedPm25InformGrade);

        //내일 데이터 저장 (pm25)
        const tmpm25InformGrade = pm25Response.data.seventhValue.informGrade;
        const tmpm25InformGradeArray = tmpm25InformGrade.split(",");
        const tmpm25InformGradeMap = tmpm25InformGradeArray.reduce(
          (map, item) => {
            const [city, grade] = item.split(":");
            map[city.trim()] = grade.trim();
            return map;
          },
          []
        );
        const tmorderedPm25InformGrade = todayData.map(
          (data) => tmpm25InformGradeMap[data.city]
        );
        setTmPm25InformGrade(tmorderedPm25InformGrade);

        //오늘 데이터 저장(o3)
        const o3InformOverall = o3Response.data.o3Value.informOverall;
        const o3InformCause = o3Response.data.o3Value.informCause;
        const o3Date = o3Response.data.o3Value.informData;
        setO3Overall(o3InformOverall);
        setO3Cause(o3InformCause);
        setO3Date(o3Date);
        const o3InformGrade = o3Response.data.o3Value.informGrade;
        const o3InformGradeArray = o3InformGrade.split(",");
        const o3InformGradeMap = o3InformGradeArray.reduce((map, item) => {
          const [city, grade] = item.split(":");
          map[city.trim()] = grade.trim();
          return map;
        }, []);
        const orderedO3InformGrade = todayData.map(
          (data) => o3InformGradeMap[data.city]
        );
        setO3InformGrade(orderedO3InformGrade);

        //내일 데이터 저장(o3)
        const tmo3InformOverall = o3Response.data.tmo3Value.informOverall;
        const tmo3InformCause = o3Response.data.tmo3Value.informCause;
        const tmO3Date = o3Response.data.tmo3Value.informData;
        setTmO3Overall(tmo3InformOverall);
        setTmO3Cause(tmo3InformCause);
        setTmO3Date(tmO3Date);
        const tmo3InformGrade = o3Response.data.tmo3Value.informGrade;
        const tmo3InformGradeArray = tmo3InformGrade.split(",");
        const tmo3InformGradeMap = tmo3InformGradeArray.reduce((map, item) => {
          const [city, grade] = item.split(":");
          map[city.trim()] = grade.trim();
          return map;
        }, []);
        const tmorderedO3InformGrade = todayData.map(
          (data) => tmo3InformGradeMap[data.city]
        );
        setTmO3InformGrade(tmorderedO3InformGrade);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const todayData = [
    { city: "서울" },
    { city: "인천" },
    { city: "경기북부" },
    { city: "경기남부" },
    { city: "영서" },
    { city: "영동" },
    { city: "대전" },
    { city: "세종" },
    { city: "충북" },
    { city: "충남" },
    { city: "광주" },
    { city: "전북" },
    { city: "전남" },
    { city: "부산" },
    { city: "대구" },
    { city: "울산" },
    { city: "경북" },
    { city: "경남" },
    { city: "제주" },
  ];

  return (
    <div className="airdata-container">
      <div className="airdata-box">
        <h2>대기질 농도 전망</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>pm10</th>
                <th>pm25</th>
                <th>o3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src={pm10Url} alt="PM-10" className="gif"/>
                </td>
                <td>
                  <img src={pm25Url} alt="PM-2.5" className="gif"/>
                </td>
                <td>
                  <img src={o3Url} alt="Ozone" className="gif"/>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <hr />
        <h2>오늘 미세먼지</h2>
        <p>{airDate}</p>
        <p className="airdata-text">{airOverall}</p>
        <table className="airdata-table">
          <thead>
            <tr>
              <th rowSpan={2}>도시</th>
              <th rowSpan={2}>서울</th>
              <th rowSpan={2}>인천</th>
              <th rowSpan={2}>경기북부</th>
              <th rowSpan={2}>경기남부</th>
              <th colSpan={2}>강원도</th>
              <th rowSpan={2}>대전</th>
              <th rowSpan={2}>세종</th>
              <th rowSpan={2}>충북</th>
              <th rowSpan={2}>충남</th>
              <th rowSpan={2}>광주</th>
              <th rowSpan={2}>전북</th>
              <th rowSpan={2}>전남</th>
              <th rowSpan={2}>부산</th>
              <th rowSpan={2}>대구</th>
              <th rowSpan={2}>울산</th>
              <th rowSpan={2}>경북</th>
              <th rowSpan={2}>경남</th>
              <th rowSpan={2}>제주</th>
            </tr>
            <tr>
              <th>영서</th>
              <th>영동</th>
              {/* {todayData.map((data) => (
                <th key={data.city}>{data.city}</th>
              ))}  db에서 받아오는 시티 목록*/}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>미세먼지</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    pm10InformGrade[index] === "좋음" &&
                    pm25InformGrade[index] === "좋음"
                      ? "blue"
                      : pm10InformGrade[index] === "나쁨" ||
                        pm25InformGrade[index] === "나쁨"
                      ? "yellow"
                      : pm10InformGrade[index] === "매우나쁨" ||
                        pm25InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {pm10InformGrade[index] === "좋음" &&
                  pm25InformGrade[index] === "좋음"
                    ? "좋음"
                    : pm10InformGrade[index] === "나쁨" ||
                      pm25InformGrade[index] === "나쁨"
                    ? "나쁨"
                    : pm10InformGrade[index] === "매우나쁨" ||
                      pm25InformGrade[index] === "매우나쁨"
                    ? "매우나쁨"
                    : "보통"}
                </td>
              ))}
            </tr>
            <tr>
              <th>PM-10</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    pm10InformGrade[index] === "좋음"
                      ? "blue"
                      : pm10InformGrade[index] === "나쁨"
                      ? "yellow"
                      : pm10InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {pm10InformGrade[index]}
                </td>
              ))}
            </tr>
            <tr>
              <th>PM-2.5</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    pm25InformGrade[index] === "좋음"
                      ? "blue"
                      : pm25InformGrade[index] === "나쁨"
                      ? "yellow"
                      : pm25InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {pm25InformGrade[index]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p>{airCause}</p>
      </div>
      {/* ---------------------------------------------------------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------------------------------------------------------- */}
      <div className="airdata-box">
        <hr />
        <h2>내일 미세먼지</h2>
        <p>{tmairDate}</p>
        <p>{tmairOverall}</p>
        <table className="airdata-table">
        <thead>
            <tr>
              <th rowSpan={2}>도시</th>
              <th rowSpan={2}>서울</th>
              <th rowSpan={2}>인천</th>
              <th rowSpan={2}>경기북부</th>
              <th rowSpan={2}>경기남부</th>
              <th colSpan={2}>강원도</th>
              <th rowSpan={2}>대전</th>
              <th rowSpan={2}>세종</th>
              <th rowSpan={2}>충북</th>
              <th rowSpan={2}>충남</th>
              <th rowSpan={2}>광주</th>
              <th rowSpan={2}>전북</th>
              <th rowSpan={2}>전남</th>
              <th rowSpan={2}>부산</th>
              <th rowSpan={2}>대구</th>
              <th rowSpan={2}>울산</th>
              <th rowSpan={2}>경북</th>
              <th rowSpan={2}>경남</th>
              <th rowSpan={2}>제주</th>
            </tr>
            <tr>
              <th>영서</th>
              <th>영동</th>
              {/* {todayData.map((data) => (
                <th key={data.city}>{data.city}</th>
              ))}  db에서 받아오는 시티 목록*/}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>미세먼지</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    tmpm10InformGrade[index] === "좋음" &&
                    tmpm25InformGrade[index] === "좋음"
                      ? "blue"
                      : tmpm10InformGrade[index] === "나쁨" ||
                        tmpm25InformGrade[index] === "나쁨"
                      ? "yellow"
                      : tmpm10InformGrade[index] === "매우나쁨" ||
                        tmpm25InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {tmpm10InformGrade[index] === "좋음" &&
                  tmpm25InformGrade[index] === "좋음"
                    ? "좋음"
                    : tmpm10InformGrade[index] === "나쁨" ||
                      tmpm25InformGrade[index] === "나쁨"
                    ? "나쁨"
                    : tmpm10InformGrade[index] === "매우나쁨" ||
                      tmpm25InformGrade[index] === "매우나쁨"
                    ? "매우나쁨"
                    : "보통"}
                </td>
              ))}
            </tr>
            <tr>
              <th>PM-10</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    tmpm10InformGrade[index] === "좋음"
                      ? "blue"
                      : tmpm10InformGrade[index] === "나쁨"
                      ? "yellow"
                      : tmpm10InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {tmpm10InformGrade[index]}
                </td>
              ))}
            </tr>
            <tr>
              <th>PM-2.5</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    tmpm25InformGrade[index] === "좋음"
                      ? "blue"
                      : tmpm25InformGrade[index] === "나쁨"
                      ? "yellow"
                      : tmpm25InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {tmpm25InformGrade[index]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p>{tmairCause}</p>
      </div>
      {/* ---------------------------------------------------------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------------------------------------------------------- */}
      {/* ---------------------------------------------------------------------------------------------------------------- */}
      <div className="airdata-box">
        <hr />
        <h2>오늘 오존농도 전망</h2>
        <p>{o3Date}</p>
        <p>{o3Overall}</p>
        <table className="airdata-table">
        <thead>
            <tr>
              <th rowSpan={2}>도시</th>
              <th rowSpan={2}>서울</th>
              <th rowSpan={2}>인천</th>
              <th rowSpan={2}>경기북부</th>
              <th rowSpan={2}>경기남부</th>
              <th colSpan={2}>강원도</th>
              <th rowSpan={2}>대전</th>
              <th rowSpan={2}>세종</th>
              <th rowSpan={2}>충북</th>
              <th rowSpan={2}>충남</th>
              <th rowSpan={2}>광주</th>
              <th rowSpan={2}>전북</th>
              <th rowSpan={2}>전남</th>
              <th rowSpan={2}>부산</th>
              <th rowSpan={2}>대구</th>
              <th rowSpan={2}>울산</th>
              <th rowSpan={2}>경북</th>
              <th rowSpan={2}>경남</th>
              <th rowSpan={2}>제주</th>
            </tr>
            <tr>
              <th>영서</th>
              <th>영동</th>
              {/* {todayData.map((data) => (
                <th key={data.city}>{data.city}</th>
              ))}  db에서 받아오는 시티 목록*/}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>O3</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    o3InformGrade[index] === "좋음"
                      ? "blue"
                      : o3InformGrade[index] === "나쁨"
                      ? "yellow"
                      : o3InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {o3InformGrade[index]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p>{o3Cause}</p>
      </div>
      <div className="airdata-box">
        <hr />
        <h2>내일 오존농도 전망</h2>
        <p>{tmo3Date}</p>
        <p>{tmo3Overall}</p>
        <table className="airdata-table">
        <thead>
            <tr>
              <th rowSpan={2}>도시</th>
              <th rowSpan={2}>서울</th>
              <th rowSpan={2}>인천</th>
              <th rowSpan={2}>경기북부</th>
              <th rowSpan={2}>경기남부</th>
              <th colSpan={2}>강원도</th>
              <th rowSpan={2}>대전</th>
              <th rowSpan={2}>세종</th>
              <th rowSpan={2}>충북</th>
              <th rowSpan={2}>충남</th>
              <th rowSpan={2}>광주</th>
              <th rowSpan={2}>전북</th>
              <th rowSpan={2}>전남</th>
              <th rowSpan={2}>부산</th>
              <th rowSpan={2}>대구</th>
              <th rowSpan={2}>울산</th>
              <th rowSpan={2}>경북</th>
              <th rowSpan={2}>경남</th>
              <th rowSpan={2}>제주</th>
            </tr>
            <tr>
              <th>영서</th>
              <th>영동</th>
              {/* {todayData.map((data) => (
                <th key={data.city}>{data.city}</th>
              ))}  db에서 받아오는 시티 목록*/}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>O3</th>
              {todayData.map((data, index) => (
                <td
                  key={data.city}
                  className={
                    tmo3InformGrade[index] === "좋음"
                      ? "blue"
                      : tmo3InformGrade[index] === "나쁨"
                      ? "yellow"
                      : tmo3InformGrade[index] === "매우나쁨"
                      ? "red"
                      : "green"
                  }
                >
                  {tmo3InformGrade[index]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p>{tmo3Cause}</p>
      </div>
    </div>
  );
}

export default AirData;