const cron = require('node-cron');

// Server 작성
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const mysql = require('mysql');
const axios = require('axios');

const connection = mysql.createConnection({
  host: '203.231.146.220',
  port: '3306',
  user: '202302_cu',
  password: '202302_cu',
  database: '202302_cu'
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database: ', error);
    return;
  }
  console.log('Connected to database!');
});

// CORS 사용
app.use(cors());

app.use(express.static('public'));

app.get('/api/cityAirdata', async (req, res) => {
  try {
    const sidoNames = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'];

    const responses = await Promise.all(sidoNames.map(async (sido) => {
      const response = await axios.get(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty',
        {
          params: {
            serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
            returnType: 'json',
            numOfRows: 3,
            pageNo: 1,
            sidoName: sido,
            ver: 1.4,
          },
        }
      );

      // 여러 개의 값을 추출하고 처리
      const dataList = response.data.response.body.items;
      const insertPromises = [];

      dataList.forEach((data) => {
        const {
          sidoName,
          dataTime,
          pm10Value,
          pm25Value,
          o3Value,
          stationName,
        } = data;

        // 이미 존재하는 레코드인지 확인
        const query = `SELECT COUNT(*) AS count FROM cityair WHERE sidoName = ? AND dataTime = ? AND stationName = ?`;
        const values = [sidoName, dataTime, stationName];

        const insertPromise = new Promise((resolve, reject) => {
          connection.query(query, values, (error, results) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              const count = results[0].count;
              if (count === 0) {
                // 데이터베이스에 삽입
                const insertQuery = `INSERT INTO cityair (sidoName, dataTime, pm10Value, pm25Value, o3Value, stationName) VALUES (?, ?, ?, ?, ?, ?)`;
                const insertValues = [sidoName, dataTime, pm10Value, pm25Value, o3Value, stationName];

                connection.query(insertQuery, insertValues, (insertError, insertResults) => {
                  if (insertError) {
                    console.error(insertError);
                    reject(insertError);
                  } else {
                    resolve();
                  }
                });
              } else {
                resolve();
              }
            }
          });
        });

        insertPromises.push(insertPromise);
      });
      // 모든 삽입 작업이 완료될 때까지 대기
      await Promise.all(insertPromises);
      return response.data;
    }));
    res.json(responses);
  } catch (error) {
    console.error('도시 대기 정보를 가져오는 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

//시도별대기정보를 나타내기 위해 테이블을 조회하는 엔드포인트
app.get('/api/cityair', (req, res) => {
  const query = `SELECT *, DATE_FORMAT(dataTime, '%Y-%m-%d %H:%i:%s') AS currentDateTime FROM cityair WHERE DATE_FORMAT(dataTime, '%Y-%m-%d') = CURDATE() ORDER BY dataTime DESC`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json(results);
  });
});

//측정소별 데이터
app.get('/api/airdata', async (req, res) => {
  try {
    const { stationName } = req.query;
    const response = await axios.get(
      'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty',
      {
        params: {
          serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
          returnType: 'json',
          numOfRows: 24,
          pageNo: 1,
          stationName: stationName,
          dataTerm: 'DAILY',
          ver: 1.4,
        },
      }
    );
    console.log(response.data);

    if (
      response.data &&
      response.data.response &&
      response.data.response.body &&
      response.data.response.body.items &&
      response.data.response.body.items.length > 0
    ) {
      const airDataItems = response.data.response.body.items;

      // 중복 데이터 필터링
      const filteredItems = await Promise.all(
        airDataItems.map(async (airData) => {
          const querySelect = 'SELECT COUNT(*) AS count FROM station WHERE stationName = ? AND dataTime = ? ';
          const valuesSelect = [airData.stationName, airData.dataTime];

          const countResult = await new Promise((resolve, reject) => {
            connection.query(querySelect, valuesSelect, (error, results) => {
              if (error) {
                console.error(error);
                reject(error);
              } else {
                resolve(results[0].count);
              }
            });
          });

          if (countResult === 0) {
            return [
              airData.stationName,
              airData.dataTime,
              airData.pm10Value,
              airData.pm25Value,
              airData.o3Value,
              airData.pm10Value24,
              airData.pm25Value24,
            ];
          }
          return null;
        })
      );

      // 유효한 값들만 추출하여 삽입
      const valuesInsert = filteredItems.filter((item) => item !== null);

      if (valuesInsert.length === 0) {
        // 이미 동일한 데이터가 존재하거나 삽입에 실패한 경우
        const querySelectToday = 'SELECT * FROM station WHERE stationName = ? AND DATE(dataTime) = CURDATE() ORDER BY dataTime DESC';
        const valuesSelectToday = [stationName];

        connection.query(querySelectToday, valuesSelectToday, (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: '데이터를 가져오는데 실패했습니다' });
          } else {
            res.json(results);
          }
        });
      } else {
        const queryInsert = `INSERT INTO station (stationName, dataTime, pm10Value, pm25Value, o3Value, pm10Value24, pm25Value24) VALUES ?`;

        connection.query(queryInsert, [valuesInsert], (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: '데이터를 데이터베이스에 삽입하는데 실패했습니다' });
          } else {
            // 삽입이 성공한 경우
            const querySelectToday = 'SELECT * FROM station WHERE stationName = ? AND DATE(dataTime) = CURDATE() ORDER BY dataTime DESC';
            const valuesSelectToday = [stationName];

            connection.query(querySelectToday, valuesSelectToday, (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: '데이터를 가져오는데 실패했습니다' });
              } else {
                res.json(results);
              }
            });
          }
        });
      }
    } else {
      res.status(500).json({ error: 'API 응답에 데이터가 없습니다' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '데이터를 가져오는데 실패했습니다' });
  }
});


//오늘/내일 대기정보(대기질 농도 전망)
app.get('/api/air', async (req, res) => {
  try {
    // //어제 날짜
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // const currentDate = new Date();
    // const today = new Date(currentDate);
    // const year = today.getFullYear();
    // const month = String(today.getMonth() + 1).padStart(2, '0');
    // const day = String(today.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;
    const response = await axios.get(
      'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
      {
        params: {
          serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
          returnType: 'json',
          numOfRows: 5,
          pageNo: 1,
          searchDate: formattedDate,
          InformCode: '',
          ver: 1.1,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

//오늘/내일/모레 예보(pm10)
app.get('/api/forecast/pm10', async (req, res) => {
  try {
    const currentDate = new Date();
    const today = new Date(currentDate);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const response = await axios.get(
      'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
      {
        params: {
          serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
          returnType: 'json',
          pageNo: 1,
          searchDate: formattedDate,
          InformCode: '',
          ver: 1.1,
        },
      }
    );

    const filteredData = response.data.response.body.items
      .filter(item => item.informCode === 'PM10' && item.informData === formattedDate)
      .map((item) => ({
        informData: item.informData,
        informCode: item.informCode,
        informOverall: item.informOverall,
        informGrade: item.informGrade,
        informCause: item.informCause,
        dataTime: item.dataTime,
      }));

    let firstValue = null;
    let sixthValue = null;

    if (filteredData.length >= 1) {
      firstValue = filteredData[0];
    }

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const nextDayYear = nextDay.getFullYear();
    const nextDayMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
    const nextDayDay = String(nextDay.getDate()).padStart(2, '0');
    const nextDayFormatted = `${nextDayYear}-${nextDayMonth}-${nextDayDay}`;

    const filteredNextDayData = response.data.response.body.items
      .filter(item => item.informCode === 'PM10' && item.informData === nextDayFormatted)
      .map((item) => ({
        informData: item.informData,
        informCode: item.informCode,
        informOverall: item.informOverall,
        informGrade: item.informGrade,
        informCause: item.informCause,
        dataTime: item.dataTime,
      }));

    if (filteredNextDayData.length >= 1) {
      sixthValue = filteredNextDayData[0];
    }

    res.json({ firstValue, sixthValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


//오늘/내일/모레 예보(pm25)
app.get('/api/forecast/pm25', async (req, res) => {
  try {
    const currentDate = new Date();
    const today = new Date(currentDate);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const response = await axios.get(
      'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
      {
        params: {
          serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
          returnType: 'json',
          pageNo: 1,
          searchDate: formattedDate,
          InformCode: '',
          ver: 1.1,
        },
      }
    );

    const filteredData = response.data.response.body.items
      .filter(item => item.informCode === 'PM25' && item.informData === formattedDate)
      .map((item) => ({
        informData: item.informData,
        informCode: item.informCode,
        informOverall: item.informOverall,
        informGrade: item.informGrade,
        informCause: item.informCause,
      }));
    let secondValue = null;
    let seventhValue = null;
    if (filteredData.length >= 1) {
      secondValue = filteredData[0];
    }
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const nextDayYear = nextDay.getFullYear();
    const nextDayMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
    const nextDayDay = String(nextDay.getDate()).padStart(2, '0');
    const nextDayFormatted = `${nextDayYear}-${nextDayMonth}-${nextDayDay}`;

    const filteredNextDayData = response.data.response.body.items
      .filter(item => item.informCode === 'PM25' && item.informData === nextDayFormatted)
      .map((item) => ({
        informData: item.informData,
        informCode: item.informCode,
        informOverall: item.informOverall,
        informGrade: item.informGrade,
        informCause: item.informCause,
        dataTime: item.dataTime,
      }));

    if (filteredNextDayData.length >= 1) {
      seventhValue = filteredNextDayData[0];
    }
    // const secondValue = filteredData[3];
    // const seventhValue = filteredData[4];
    res.json({ secondValue, seventhValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
//오늘/내일/모레 예보(o3)
app.get('/api/forecast/o3', async (req, res) => {
  try {
    // const currentDate = new Date();
    // const tomorrow = new Date(currentDate);
    // tomorrow.setDate(currentDate.getDate() + 1);
    // const year = tomorrow.getFullYear();
    // const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    // const day = String(tomorrow.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;

    const currentDate = new Date();
    const today = new Date(currentDate);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const response = await axios.get(
      'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
      {
        params: {
          serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
          returnType: 'json',
          pageNo: 1,
          searchDate: formattedDate,
          InformCode: '',
          ver: 1.1,
        },
      }
    );

    const filteredData = response.data.response.body.items
      .filter(item => item.informCode === 'O3' && item.informData === formattedDate)
      .map((item) => ({
        informData: item.informData,
        informCode: item.informCode,
        informOverall: item.informOverall,
        informGrade: item.informGrade,
        informCause: item.informCause,
      }));
    let o3Value = null;
    let tmo3Value = null;
    if (filteredData.length >= 1) {
      o3Value = filteredData[0];
    }
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const nextDayYear = nextDay.getFullYear();
    const nextDayMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
    const nextDayDay = String(nextDay.getDate()).padStart(2, '0');
    const nextDayFormatted = `${nextDayYear}-${nextDayMonth}-${nextDayDay}`;

    const filteredNextDayData = response.data.response.body.items
      .filter(item => item.informCode === 'O3' && item.informData === nextDayFormatted)
      .map((item) => ({
        informData: item.informData,
        informCode: item.informCode,
        informOverall: item.informOverall,
        informGrade: item.informGrade,
        informCause: item.informCause,
        dataTime: item.dataTime,
      }));

    if (filteredNextDayData.length >= 1) {
      tmo3Value = filteredNextDayData[0];
    }
    // const o3Value = filteredData[9];
    // const tmo3Value = filteredData[6];
    res.json({ o3Value, tmo3Value });
    // res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

//주간예보
app.get('/api/weekForecast', async (req, res) => {
  try {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const response = await axios.get(
      'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustWeekFrcstDspth',
      {
        params: {
          serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
          returnType: 'json',
          numOfRows: 20,
          pageNo: 1,
          searchDate: formattedDate,
        },
      }
    );
    const filteredData = response.data.response.body.items
      .map((item) => ({
        frcstOneDt: item.frcstOneDt,
        frcstOneCn: item.frcstOneCn,
        frcstTwoDt: item.frcstTwoDt,
        frcstTwoCn: item.frcstTwoCn,
        frcstThreeDt: item.frcstThreeDt,
        frcstThreeCn: item.frcstThreeCn,
        frcstFourDt: item.frcstFourDt,
        frcstFourCn: item.frcstFourCn,
      }));

    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
// 서버가 잘 동작하고 있는지 확인
server.listen(8080, () => {
  console.log('server is running on 8080');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//시계가 30분일 때 서버 실행
cron.schedule('5 * * * * *', function () {
  console.log("30분입니다. 서버 재시동");
  app.get('/api', (req, res) => {
    res.send({ message: 'hello' });
  });

  //시도별 측정데이터
  app.get('/api/cityAirdata', async (req, res) => {
    try {
      const sidoNames = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'];
  
      const responses = await Promise.all(sidoNames.map(async (sido) => {
        const response = await axios.get(
          'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty',
          {
            params: {
              serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
              returnType: 'json',
              numOfRows: 3,
              pageNo: 1,
              sidoName: sido,
              ver: 1.4,
            },
          }
        );
  
        // 여러 개의 값을 추출하고 처리
        const dataList = response.data.response.body.items;
        const insertPromises = [];
  
        dataList.forEach((data) => {
          const {
            sidoName,
            dataTime,
            pm10Value,
            pm25Value,
            o3Value,
            stationName,
          } = data;
  
          // 이미 존재하는 레코드인지 확인
          const query = `SELECT COUNT(*) AS count FROM cityair WHERE sidoName = ? AND dataTime = ? AND stationName = ?`;
          const values = [sidoName, dataTime, stationName];
  
          const insertPromise = new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
              if (error) {
                console.error(error);
                reject(error);
              } else {
                const count = results[0].count;
                if (count === 0) {
                  // 데이터베이스에 삽입
                  const insertQuery = `INSERT INTO cityair (sidoName, dataTime, pm10Value, pm25Value, o3Value, stationName) VALUES (?, ?, ?, ?, ?, ?)`;
                  const insertValues = [sidoName, dataTime, pm10Value, pm25Value, o3Value, stationName];
  
                  connection.query(insertQuery, insertValues, (insertError, insertResults) => {
                    if (insertError) {
                      console.error(insertError);
                      reject(insertError);
                    } else {
                      resolve();
                    }
                  });
                } else {
                  resolve();
                }
              }
            });
          });
  
          insertPromises.push(insertPromise);
        });
        // 모든 삽입 작업이 완료될 때까지 대기
        await Promise.all(insertPromises);
        return response.data;
      }));
      res.json(responses);
    } catch (error) {
      console.error('도시 대기 정보를 가져오는 중 오류 발생:', error);
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  });
  
  //시도별대기정보를 나타내기 위해 테이블을 조회하는 엔드포인트
  app.get('/api/cityair', (req, res) => {
    const query = `SELECT *, DATE_FORMAT(dataTime, '%Y-%m-%d %H:%i:%s') AS currentDateTime FROM cityair WHERE DATE_FORMAT(dataTime, '%Y-%m-%d') = CURDATE() ORDER BY dataTime DESC`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Error fetching data from database' });
        return;
      }
      res.json(results);
    });
  });
  
  //측정소별 데이터
  app.get('/api/airdata', async (req, res) => {
    try {
      const { stationName } = req.query;
      const response = await axios.get(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty',
        {
          params: {
            serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
            returnType: 'json',
            numOfRows: 24,
            pageNo: 1,
            stationName: stationName,
            dataTerm: 'DAILY',
            ver: 1.4,
          },
        }
      );
      console.log(response.data);
  
      if (
        response.data &&
        response.data.response &&
        response.data.response.body &&
        response.data.response.body.items &&
        response.data.response.body.items.length > 0
      ) {
        const airDataItems = response.data.response.body.items;
  
        // 중복 데이터 필터링
        const filteredItems = await Promise.all(
          airDataItems.map(async (airData) => {
            const querySelect = 'SELECT COUNT(*) AS count FROM station WHERE stationName = ? AND dataTime = ? ';
            const valuesSelect = [airData.stationName, airData.dataTime];
  
            const countResult = await new Promise((resolve, reject) => {
              connection.query(querySelect, valuesSelect, (error, results) => {
                if (error) {
                  console.error(error);
                  reject(error);
                } else {
                  resolve(results[0].count);
                }
              });
            });
  
            if (countResult === 0) {
              return [
                airData.stationName,
                airData.dataTime,
                airData.pm10Value,
                airData.pm25Value,
                airData.o3Value,
                airData.pm10Value24,
                airData.pm25Value24,
              ];
            }
            return null;
          })
        );
  
        // 유효한 값들만 추출하여 삽입
        const valuesInsert = filteredItems.filter((item) => item !== null);
  
        if (valuesInsert.length === 0) {
          // 이미 동일한 데이터가 존재하거나 삽입에 실패한 경우
          const querySelectToday = 'SELECT * FROM station WHERE stationName = ? AND DATE(dataTime) = CURDATE() ORDER BY dataTime DESC';
          const valuesSelectToday = [stationName];
  
          connection.query(querySelectToday, valuesSelectToday, (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: '데이터를 가져오는데 실패했습니다' });
            } else {
              res.json(results);
            }
          });
        } else {
          const queryInsert = `INSERT INTO station (stationName, dataTime, pm10Value, pm25Value, o3Value, pm10Value24, pm25Value24) VALUES ?`;
  
          connection.query(queryInsert, [valuesInsert], (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: '데이터를 데이터베이스에 삽입하는데 실패했습니다' });
            } else {
              // 삽입이 성공한 경우
              const querySelectToday = 'SELECT * FROM station WHERE stationName = ? AND DATE(dataTime) = CURDATE() ORDER BY dataTime DESC';
              const valuesSelectToday = [stationName];
  
              connection.query(querySelectToday, valuesSelectToday, (error, results) => {
                if (error) {
                  console.error(error);
                  res.status(500).json({ error: '데이터를 가져오는데 실패했습니다' });
                } else {
                  res.json(results);
                }
              });
            }
          });
        }
      } else {
        res.status(500).json({ error: 'API 응답에 데이터가 없습니다' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '데이터를 가져오는데 실패했습니다' });
    }
  });
  
  
  //오늘/내일 대기정보(대기질 농도 전망)
  app.get('/api/air', async (req, res) => {
    try {
      // //어제 날짜
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, '0');
      const day = String(yesterday.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      // const currentDate = new Date();
      // const today = new Date(currentDate);
      // const year = today.getFullYear();
      // const month = String(today.getMonth() + 1).padStart(2, '0');
      // const day = String(today.getDate()).padStart(2, '0');
      // const formattedDate = `${year}-${month}-${day}`;
      const response = await axios.get(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
        {
          params: {
            serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
            returnType: 'json',
            numOfRows: 5,
            pageNo: 1,
            searchDate: formattedDate,
            InformCode: '',
            ver: 1.1,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
  //오늘/내일/모레 예보(pm10)
  app.get('/api/forecast/pm10', async (req, res) => {
    try {
      const currentDate = new Date();
      const today = new Date(currentDate);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      const response = await axios.get(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
        {
          params: {
            serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
            returnType: 'json',
            pageNo: 1,
            searchDate: formattedDate,
            InformCode: '',
            ver: 1.1,
          },
        }
      );
  
      const filteredData = response.data.response.body.items
        .filter(item => item.informCode === 'PM10' && item.informData === formattedDate)
        .map((item) => ({
          informData: item.informData,
          informCode: item.informCode,
          informOverall: item.informOverall,
          informGrade: item.informGrade,
          informCause: item.informCause,
          dataTime: item.dataTime,
        }));
  
      let firstValue = null;
      let sixthValue = null;
  
      if (filteredData.length >= 1) {
        firstValue = filteredData[0];
      }
  
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      const nextDayYear = nextDay.getFullYear();
      const nextDayMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
      const nextDayDay = String(nextDay.getDate()).padStart(2, '0');
      const nextDayFormatted = `${nextDayYear}-${nextDayMonth}-${nextDayDay}`;
  
      const filteredNextDayData = response.data.response.body.items
        .filter(item => item.informCode === 'PM10' && item.informData === nextDayFormatted)
        .map((item) => ({
          informData: item.informData,
          informCode: item.informCode,
          informOverall: item.informOverall,
          informGrade: item.informGrade,
          informCause: item.informCause,
          dataTime: item.dataTime,
        }));
  
      if (filteredNextDayData.length >= 1) {
        sixthValue = filteredNextDayData[0];
      }
  
      res.json({ firstValue, sixthValue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
  
  //오늘/내일/모레 예보(pm25)
  app.get('/api/forecast/pm25', async (req, res) => {
    try {
      const currentDate = new Date();
      const today = new Date(currentDate);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      const response = await axios.get(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
        {
          params: {
            serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
            returnType: 'json',
            pageNo: 1,
            searchDate: formattedDate,
            InformCode: '',
            ver: 1.1,
          },
        }
      );
  
      const filteredData = response.data.response.body.items
        .filter(item => item.informCode === 'PM25' && item.informData === formattedDate)
        .map((item) => ({
          informData: item.informData,
          informCode: item.informCode,
          informOverall: item.informOverall,
          informGrade: item.informGrade,
          informCause: item.informCause,
        }));
      let secondValue = null;
      let seventhValue = null;
      if (filteredData.length >= 1) {
        secondValue = filteredData[0];
      }
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      const nextDayYear = nextDay.getFullYear();
      const nextDayMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
      const nextDayDay = String(nextDay.getDate()).padStart(2, '0');
      const nextDayFormatted = `${nextDayYear}-${nextDayMonth}-${nextDayDay}`;
  
      const filteredNextDayData = response.data.response.body.items
        .filter(item => item.informCode === 'PM25' && item.informData === nextDayFormatted)
        .map((item) => ({
          informData: item.informData,
          informCode: item.informCode,
          informOverall: item.informOverall,
          informGrade: item.informGrade,
          informCause: item.informCause,
          dataTime: item.dataTime,
        }));
  
      if (filteredNextDayData.length >= 1) {
        seventhValue = filteredNextDayData[0];
      }
      // const secondValue = filteredData[3];
      // const seventhValue = filteredData[4];
      res.json({ secondValue, seventhValue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  //오늘/내일/모레 예보(o3)
  app.get('/api/forecast/o3', async (req, res) => {
    try {
      // const currentDate = new Date();
      // const tomorrow = new Date(currentDate);
      // tomorrow.setDate(currentDate.getDate() + 1);
      // const year = tomorrow.getFullYear();
      // const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      // const day = String(tomorrow.getDate()).padStart(2, '0');
      // const formattedDate = `${year}-${month}-${day}`;
  
      const currentDate = new Date();
      const today = new Date(currentDate);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      const response = await axios.get(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth',
        {
          params: {
            serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
            returnType: 'json',
            pageNo: 1,
            searchDate: formattedDate,
            InformCode: '',
            ver: 1.1,
          },
        }
      );
  
      const filteredData = response.data.response.body.items
        .filter(item => item.informCode === 'O3' && item.informData === formattedDate)
        .map((item) => ({
          informData: item.informData,
          informCode: item.informCode,
          informOverall: item.informOverall,
          informGrade: item.informGrade,
          informCause: item.informCause,
        }));
      let o3Value = null;
      let tmo3Value = null;
      if (filteredData.length >= 1) {
        o3Value = filteredData[0];
      }
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      const nextDayYear = nextDay.getFullYear();
      const nextDayMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
      const nextDayDay = String(nextDay.getDate()).padStart(2, '0');
      const nextDayFormatted = `${nextDayYear}-${nextDayMonth}-${nextDayDay}`;
  
      const filteredNextDayData = response.data.response.body.items
        .filter(item => item.informCode === 'O3' && item.informData === nextDayFormatted)
        .map((item) => ({
          informData: item.informData,
          informCode: item.informCode,
          informOverall: item.informOverall,
          informGrade: item.informGrade,
          informCause: item.informCause,
          dataTime: item.dataTime,
        }));
  
      if (filteredNextDayData.length >= 1) {
        tmo3Value = filteredNextDayData[0];
      }
      // const o3Value = filteredData[9];
      // const tmo3Value = filteredData[6];
      res.json({ o3Value, tmo3Value });
      // res.json(filteredData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
  //주간예보
  app.get('/api/weekForecast', async (req, res) => {
    try {
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, '0');
      const day = String(yesterday.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      const response = await axios.get(
        'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustWeekFrcstDspth',
        {
          params: {
            serviceKey: 'M91LFcDzOmoYDVIjwbRjCIMwcEhtpdzfvVMshiPnF6MPbuohnJDvgTaaO93AioZC9AYa925jYEoI47TDslQgVA==',
            returnType: 'json',
            numOfRows: 20,
            pageNo: 1,
            searchDate: formattedDate,
          },
        }
      );
      const filteredData = response.data.response.body.items
        .map((item) => ({
          frcstOneDt: item.frcstOneDt,
          frcstOneCn: item.frcstOneCn,
          frcstTwoDt: item.frcstTwoDt,
          frcstTwoCn: item.frcstTwoCn,
          frcstThreeDt: item.frcstThreeDt,
          frcstThreeCn: item.frcstThreeCn,
          frcstFourDt: item.frcstFourDt,
          frcstFourCn: item.frcstFourCn,
        }));
  
      res.json(filteredData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  // 서버가 잘 동작하고 있는지 확인
  server.listen(8080, () => {
    console.log('server is running on 8080');
  });
})