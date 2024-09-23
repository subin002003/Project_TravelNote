import React, { useEffect, useState } from "react";
import "./Schedule.css";

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(1);

  // 각 날짜에 대한 일정 저장
  const itineraries = {
    1: {
      date: "2024.09.12",
      places: ["장소 1", "장소 2"],
    },
    2: {
      date: "2024.09.13",
      places: ["장소 3", "장소 4"],
    },
    3: {
      date: "2024.09.14",
      places: ["장소 5", "장소 6"],
    },
  };

  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.5665, lng: 126.978 }, // 서울의 좌표
        zoom: 10,
      });

      // 마커 추가
      new window.google.maps.Marker({
        position: { lat: 37.5665, lng: 126.978 },
        map: map,
        title: "서울",
      });
    };

    // Google Maps API 스크립트를 동적으로 추가
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = initMap; // 스크립트 로드 후 initMap 호출
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
    };
  }, []);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="schedule-wrap">
      <div className="content">
        {/* 좌측 일정 패널 */}
        <div className="itinerary-panel">
          <h1>일정 관리</h1>
          <div className="day-selector">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                className={selectedDay === day ? "selected" : ""}
                onClick={() => handleDayClick(day)}
              >
                Day {day}
              </button>
            ))}
          </div>
          <div className="selected-day-itinerary">
            <h2>{itineraries[selectedDay].date}</h2>
            <ul>
              {itineraries[selectedDay].places.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>
          </div>
          <button className="add-location-btn">장소 추가</button>
          <button className="save-btn">일정 저장</button>
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
