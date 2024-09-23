import React, { useState } from "react";
import "./Schedule.css";

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(1); // 선택된 날짜
  const [itineraries, setItineraries] = useState([
    {
      day: 1,
      date: "2024-09-12",
      activities: ["장소 1", "장소 2"],
    },
    {
      day: 2,
      date: "2024-09-13",
      activities: ["장소 3", "장소 4"],
    },
    {
      day: 3,
      date: "2024-09-14",
      activities: ["장소 5", "장소 6"],
    },
  ]);

  const handleDayClick = (day) => {
    setSelectedDay(day); // 클릭한 날짜로 상태 변경
  };

  return (
    <div className="schedule-wrap">
      {/* 메인 콘텐츠 */}
      <main className="content">
        {/* 좌측 일정 리스트 */}
        <div className="itinerary-panel">
          <h1>도시명</h1>
          <p>2024-09-12 ~ 2024-09-14</p>
          <div className="day-selector">
            <button
              onClick={() => handleDayClick(1)}
              className={selectedDay === 1 ? "selected" : ""}
            >
              day1
            </button>
            <button
              onClick={() => handleDayClick(2)}
              className={selectedDay === 2 ? "selected" : ""}
            >
              day2
            </button>
            <button
              onClick={() => handleDayClick(3)}
              className={selectedDay === 3 ? "selected" : ""}
            >
              day3
            </button>
          </div>
          <div className="selected-day-itinerary">
            <h2>{selectedDay}일차 일정</h2>
            <ul>
              {itineraries
                .find((itinerary) => itinerary.day === selectedDay)
                .activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
            </ul>
          </div>
          <button className="add-location-btn">장소 추가</button>
          <button className="save-btn">일정 저장</button>
        </div>

        {/* 지도 영역 */}
        <div className="map-container">
          <div className="map">지도 표시 영역</div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
