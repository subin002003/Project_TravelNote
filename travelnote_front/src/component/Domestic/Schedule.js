import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Schedule = () => {
  const { itineraryNo } = useParams(); // URL에서 itineraryNo 가져옴
  const [schedule, setSchedule] = useState(null); // 일정 데이터를 저장할 상태
  const [selectedDay, setSelectedDay] = useState(1); // 선택된 날짜 상태
  const [locations, setLocations] = useState([]); // 선택된 장소 상태
  const backServer = process.env.REACT_APP_BACK_SERVER;

  useEffect(() => {
    axios
      .get(`${backServer}/regions/schedule/${itineraryNo}`)
      .then((response) => {
        setSchedule(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  }, [itineraryNo, backServer]);

  const handleDayClick = (day) => {
    setSelectedDay(day); // 클릭한 날짜로 상태 변경
  };

  const handleAddLocation = () => {
    // 새로운 장소 추가 로직
    setLocations([...locations, `장소 ${locations.length + 1}`]);
  };

  if (!schedule) {
    return <div>일정을 불러오는 중...</div>;
  }

  return (
    <div>
      <main>
        <h1>{schedule.title}의 일정</h1>
        <p>시작일: {schedule.startDate}</p>
        <p>종료일: {schedule.endDate}</p>

        <div className="schedule-container">
          <div className="day-tabs">
            <button onClick={() => handleDayClick(1)}>Day 1</button>
            <button onClick={() => handleDayClick(2)}>Day 2</button>
            <button onClick={() => handleDayClick(3)}>Day 3</button>
          </div>

          <div className="location-list">
            <h2>{selectedDay}일차 일정</h2>
            {locations.map((location, index) => (
              <div key={index}>{location}</div>
            ))}
            <button onClick={handleAddLocation}>장소 추가</button>
          </div>

          <div className="map">
            {/* 지도 컴포넌트 추가 */}
            <p>지도 영역 (여기에 지도 표시)</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
