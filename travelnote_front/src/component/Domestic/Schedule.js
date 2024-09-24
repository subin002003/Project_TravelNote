import React, { useEffect, useState } from "react";
import "./Schedule.css";

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentRange, setCurrentRange] = useState([1, 3]);
  const [map, setMap] = useState(null);

  // 각 날짜에 대한 일정 저장
  const itineraries = {
    1: {
      date: "2024.09.12",
      places: [
        { name: "장소 1", lat: 37.5665, lng: 126.978 },
        { name: "장소 2", lat: 37.565, lng: 126.976 },
      ],
    },
    2: {
      date: "2024.09.13",
      places: [
        { name: "장소 3", lat: 37.564, lng: 126.975 },
        { name: "장소 4", lat: 37.563, lng: 126.974 },
      ],
    },
    3: {
      date: "2024.09.14",
      places: [
        { name: "장소 5", lat: 37.562, lng: 126.973 },
        { name: "장소 6", lat: 37.561, lng: 126.972 },
      ],
    },
    4: {
      date: "2024.09.15",
      places: [
        { name: "장소 7", lat: 37.56, lng: 126.971 },
        { name: "장소 8", lat: 37.559, lng: 126.97 },
      ],
    },
    5: {
      date: "2024.09.16",
      places: [
        { name: "장소 9", lat: 37.558, lng: 126.969 },
        { name: "장소 10", lat: 37.557, lng: 126.968 },
      ],
    },
    // 필요에 따라 계속 추가
  };

  // 날짜 배열 생성
  const days = Object.keys(itineraries).map(Number);

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: 37.5665, lng: 126.978 },
          zoom: 10,
        }
      );

      setMap(mapInstance); // 맵 인스턴스를 상태에 저장
    };

    // Google Maps API 스크립트를 동적으로 추가
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (map && itineraries[selectedDay]) {
      const { places } = itineraries[selectedDay];

      // 지도와 마커 업데이트
      map.setCenter({ lat: 37.5665, lng: 126.978 });

      // 이전 마커 제거
      if (map.markers) {
        map.markers.forEach((marker) => marker.setMap(null));
      }

      // 새 마커 추가
      map.markers = [];
      places.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: map,
          title: place.name,
        });
        map.markers.push(marker);
      });
    }
  }, [map, selectedDay]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handlePreviousRange = () => {
    setCurrentRange((prevRange) => {
      const newStart = Math.max(prevRange[0] - 3, days[0]);
      const newEnd = Math.min(newStart + 2, days[days.length - 1]);
      return [newStart, newEnd];
    });
  };

  const handleNextRange = () => {
    setCurrentRange((prevRange) => {
      const newStart = Math.min(prevRange[1] + 1, days[days.length - 1]) - 2;
      const newEnd = Math.min(newStart + 2, days[days.length - 1]);
      return [newStart, newEnd];
    });
  };

  return (
    <div className="schedule-wrap">
      <div className="content">
        {/* 좌측 일정 패널 */}
        <div className="itinerary-panel">
          <div className="day-selector">
            <button
              onClick={handlePreviousRange}
              disabled={currentRange[0] === days[0]}
            >
              &lt;
            </button>
            {[...days]
              .filter((day) => day >= currentRange[0] && day <= currentRange[1])
              .map((day) => (
                <button
                  key={day}
                  className={selectedDay === day ? "selected" : ""}
                  onClick={() => handleDayClick(day)}
                >
                  Day {day}
                </button>
              ))}
            <button
              onClick={handleNextRange}
              disabled={currentRange[1] === days[days.length - 1]}
            >
              &gt;
            </button>
          </div>
          {itineraries[selectedDay] && (
            <div className="selected-day-itinerary">
              <h2>{itineraries[selectedDay].date}</h2>
              <ul>
                {itineraries[selectedDay].places.map((place, index) => (
                  <li key={index}>{place.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="button-container">
            <button className="add-location-btn">장소 추가</button>
            <button className="save-btn">일정 저장</button>
          </div>
        </div>

        {/* 우측 지도 패널 */}
        <div className="map-container">
          <div
            id="map"
            className="map"
            style={{ height: "100%", width: "100%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
