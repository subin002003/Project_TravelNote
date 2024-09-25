import React, { useEffect, useState } from "react";
import "./Schedule.css";
import axios from "axios";
import { useParams } from "react-router-dom";

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
  const { itineraryNo } = useParams();

  useEffect(() => {
    axios
      .get(`${backServer}/schedule/getItinerary/${itineraryNo}`)
      .then((res) => {
        console.log(res);
        setItinerary(res.data);
      })
      .catch((error) => {
        console.error("일정을 불러오는 데 실패했습니다:", error);
      });
  }, [backServer, itineraryNo]);

  const days = Object.keys(itinerary).map(Number);

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: 37.53381, lng: 126.896904 },
          zoom: 18,
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
  }, [googleMapsApiKey]);

  useEffect(() => {
    if (map && itinerary[selectedDay]) {
      const { places } = itinerary[selectedDay];

      map.setCenter({ lat: 37.5665, lng: 126.978 });

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
  }, [map, selectedDay, itinerary]);

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

        // 지도와 마커 업데이트
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
        {/* 가운데 패널 */}
        <div className="right-itinerary">
          <button className="air-btn">기차편 추가</button>
          <button
            className="itinerary-btn"
            onClick={handleItineraryButtonClick}
          >
            일정 추가
          </button>
          <div className="search">
            <input
              type="text"
              placeholder="장소 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} className="search-btn1">
              검색
            </button>
          </div>

          {showItineraryForm && (
            <div className="itinerary">
              <h3>새로운 일정 추가</h3>
              <input type="text" placeholder="관광지 이름" />
              <button className="add-itinerary-btn">추가</button>
            </div>
          )}
        </div>
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
