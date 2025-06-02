import React, { useEffect } from 'react';

function Home() {
  useEffect(() => {
    const initMap = () => {
      const mapOptions = {
        center: { lat: 35.911919, lng: 128.810988 },
        zoom: 15,
      };

      const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

      // 마커 생성 및 지도에 추가
      const marker = new window.google.maps.Marker({
        position: { lat: 35.911919, lng: 128.810988 },
        map: map,
        title: 'DCU',
        icon: {
          url: 'https://www.pngwing.com/ko/free-png-zhbdl',
          scaledSize: new window.google.maps.Size(50, 50), // 마커 이미지 크기 설정
        },
      });

      // 추가적인 마커 설정이나 이벤트 처리를 원한다면 여기에 작성할 수 있습니다.
    };

    window.initMap = initMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCI_A__sIFQj0_nWVnViSbY96wPHKbsV_Q&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}

export default Home;
