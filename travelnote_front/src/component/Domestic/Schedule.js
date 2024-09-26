import React, { useEffect, useState } from "react";
import "./Schedule.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getDate, getMonth, getYear } from "date-fns";
import SchedulePlanList from "./SchedulePlanList";

const Schedule = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const [selectedDay, setSelectedDay] = useState(1);
  const [currentRange, setCurrentRange] = useState([1, 3]);
  const [map, setMap] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [showItineraryForm, setShowItineraryForm] = useState(false); // 일정 추가 폼 표시 상태
  const [totalPlanDates, setTotalPlanDates] = useState([]); // 전체 일정 날짜
  const [planPageOption, setPlanPageOption] = useState(1); // 페이지 옵션
  const [cityCoordinates, setCityCoordinates] = useState({
    lat: 37.5665,
    lng: 126.978,
  }); // 기본 서울 좌표
  const { itineraryNo, city } = useParams(); // city 파라미터 추가

  useEffect(() => {
    axios
      .get(`${backServer}/domestic/getItinerary/${itineraryNo}`)
      .then((res) => {
        setItinerary(res.data);
        const dates = [];
        const startDate = new Date(res.data.itineraryStartDate);
        const endDate = new Date(res.data.itineraryEndDate);

        while (startDate <= endDate) {
          const year = getYear(startDate);
          const month = String(getMonth(startDate) + 1).padStart(2, "0");
          const date = String(getDate(startDate)).padStart(2, "0");
          const newDate = year + "-" + month + "-" + date;
          dates.push(newDate);
          startDate.setDate(startDate.getDate() + 1);
        }

        setTotalPlanDates(dates);
      })
      .catch((error) => {
        console.error("일정을 불러오는 데 실패했습니다:", error);
      });
  }, [backServer, itineraryNo]);

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: cityCoordinates, // 초기 중심 좌표 설정
          zoom: 12,
        }
      );
      setMap(mapInstance);
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [googleMapsApiKey, cityCoordinates]);

  useEffect(() => {
    if (map && itinerary[selectedDay]) {
      const { places } = itinerary[selectedDay];
      map.setCenter(cityCoordinates); // 도시 중심 좌표로 이동

      if (map.markers) {
        map.markers.forEach((marker) => marker.setMap(null));
      }

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
  }, [map, selectedDay, itinerary, cityCoordinates]);

  useEffect(() => {
    // 도시 이름에 따라 좌표를 설정합니다. 이 예제에서는 간단한 매핑을 사용합니다.
    const cityCoordinatesMap = {
      서울: { lat: 37.5665, lng: 126.978 },
      부산: { lat: 35.1796, lng: 129.0756 },
      포항: { lat: 129.3434808, lng: 36.0190178 },
      제주: { lat: 126.5125556, lng: 33.25235 },
      인천: { lat: 126.7052062, lng: 37.4562557 },
      강릉: { lat: 128.8784972, lng: 37.74913611 },
      춘천: { lat: 127.7323111, lng: 37.87854167 },
      가평: { lat: 127.5117778, lng: 37.82883056 },
      군산: { lat: 126.7388444, lng: 35.96464167 },
      경주: { lat: 129.2270222, lng: 35.85316944 },
      통영: { lat: 128.4352778, lng: 34.85125833 },
      수원: { lat: 127.0122222, lng: 37.30101111 },
      목포: { lat: 126.3944194, lng: 34.80878889 },
      대전: { lat: 127.4548596, lng: 36.31204028 },
      남원: { lat: 127.3925, lng: 35.41325556 },
      영월: { lat: 128.4640194, lng: 37.18086111 },
      여수: { lat: 127.6643861, lng: 34.75731111 },
      안동: { lat: 128.7316222, lng: 36.56546389 },
      전주: { lat: 127.1219194, lng: 35.80918889 },
      제천: { lat: 128.1931528, lng: 37.12976944 },
    };

    if (city && cityCoordinatesMap[city]) {
      setCityCoordinates(cityCoordinatesMap[city]);
    }
  }, [city]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handlePreviousRange = () => {
    setCurrentRange((prevRange) => {
      const newStart = Math.max(prevRange[1] - 3, 1);
      const newEnd = Math.min(newStart + 2, totalPlanDates.length);
      return [newStart, newEnd];
    });
  };

  const handleNextRange = () => {
    setCurrentRange((prevRange) => {
      const newStart = Math.min(prevRange[1] + 1, totalPlanDates.length) - 2;
      const newEnd = Math.min(newStart + 2, totalPlanDates.length);
      return [newStart, newEnd];
    });
  };

  const handleSearch = () => {
    axios
      .get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
        params: {
          query: searchTerm,
          key: googleMapsApiKey,
        },
      })
      .then((response) => {
        const results = response.data.results;
        setSearchResults(results);

        if (map) {
          map.setCenter({
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng,
          });

          if (map.markers) {
            map.markers.forEach((marker) => marker.setMap(null));
          }

          map.markers = [];
          results.forEach((place) => {
            const marker = new window.google.maps.Marker({
              position: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              },
              map: map,
              title: place.name,
            });
            map.markers.push(marker);
          });
        }
      })
      .catch((error) => {
        console.error("장소 검색에 실패했습니다:", error);
      });
  };

  const handleItineraryButtonClick = () => {
    setShowItineraryForm((prevShow) => !prevShow); // 일정 추가 폼을 토글
  };

  return (
    <div className="schedule-wrap">
      <div className="content">
        <div className="itinerary-panel">
          <div className="schedule-plan">
            <SchedulePlanList
              itinerary={itinerary}
              planDays={totalPlanDates}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              totalPlanDates={totalPlanDates}
              planPageOption={planPageOption}
              setPlanPageOption={setPlanPageOption}
            />
          </div>
          <div className="day-selector">
            <button
              onClick={handlePreviousRange}
              disabled={currentRange[0] === 1}
            >
              &lt;
            </button>
            {[...totalPlanDates]
              .filter(
                (day, index) =>
                  index >= currentRange[0] - 1 && index <= currentRange[1] - 1
              )
              .map((day, index) => (
                <button
                  key={day}
                  className={selectedDay === index + 1 ? "selected" : ""}
                  onClick={() => handleDayClick(index + 1)}
                >
                  {day}
                </button>
              ))}
            <button
              onClick={handleNextRange}
              disabled={currentRange[1] === totalPlanDates.length}
            >
              &gt;
            </button>
          </div>
          {itinerary[selectedDay] && (
            <div className="selected-day-itinerary">
              <h2>{itinerary[selectedDay].date}</h2>
              <ul>
                {itinerary[selectedDay].places.map((place, index) => (
                  <li key={index}>{place.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="button-container">
            <button className="save-btn">일정 저장</button>
          </div>
        </div>
        <div className="map-container">
          <div id="map" style={{ height: "100%", width: "100%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
