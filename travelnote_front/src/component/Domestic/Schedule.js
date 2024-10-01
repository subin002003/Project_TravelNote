import React, { useEffect, useState } from "react";
import "./Schedule.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getDate, getMonth, getYear } from "date-fns";
import SchedulePlanList from "./SchedulePlanList";

const Schedule = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const trainApiKey = process.env.REACT_APP_TRAIN_API_KEY;
  const [planDays, setPlanDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [planPageOption, setPlanPageOption] = useState(1);
  const [map, setMap] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const [totalPlanDates, setTotalPlanDates] = useState([]);
  const [cityCoordinates, setCityCoordinates] = useState({
    lat: 37.5665,
    lng: 126.93,
  });
  const [trainSchedules, setTrainSchedules] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showTrainSearch, setShowTrainSearch] = useState(false); // 기차편 검색 상태
  const [searchResults, setSearchResults] = useState([]);
  const [trainDeparture, setTrainDeparture] = useState(""); // 출발지 상태
  const [trainArrival, setTrainArrival] = useState(""); // 도착지 상태
  const { itineraryNo, city } = useParams();

  // 일정에 추가할 리스트 항목 상태
  const [selectedPlans, setSelectedPlans] = useState([]);

  // 마커 상태 추가
  const [markers, setMarkers] = useState([]);

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
          center: cityCoordinates,
          zoom: 15,
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
    if (map) {
      map.setCenter(cityCoordinates);
    }
  }, [map, cityCoordinates]);

  useEffect(() => {
    const cityCoordinatesMap = {
      서울: { lat: 37.5665, lng: 126.978 },
      부산: { lat: 35.1796, lng: 129.0756 },
    };

    if (city && cityCoordinatesMap[city]) {
      setCityCoordinates(cityCoordinatesMap[city]);
    }
  }, [city]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;

    if (searchTerm && searchTerm.length >= 2) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        query: searchTerm,
        location: cityCoordinates,
        radius: 500,
        fields: ["name", "geometry", "place_id", "formatted_address", "photos"],
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const places = results.map((place) => ({
            name: place.name,
            formattedAddress: place.formatted_address,
            geometry: place.geometry,
          }));
          setSearchResults(places);
          updateMarkers(places); // 마커 업데이트 호출
        } else {
          console.error("검색에 실패했습니다: ", status);
        }
      });
    } else {
      setSearchResults([]); // 검색 결과 초기화
      updateMarkers([]); // 검색어가 없을 경우 마커 제거 및 상태 초기화
      setMarkers([]); // 마커 상태 초기화
    }
  };

  const updateMarkers = (places) => {
    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    // 새로운 마커 생성
    const newMarkers = places.map((place) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        map: map,
        title: place.name,
      });

      const infoWindow = new window.google.maps.InfoWindow();

      // 마커 클릭 시 InfoWindow 표시
      marker.addListener("click", () => {
        infoWindow.setContent(
          `<div><strong>${place.name}</strong><br>${place.formattedAddress}</div>`
        );
        infoWindow.open(map, marker);
      });

      return marker;
    });

    // 마커 상태 업데이트
    setMarkers(newMarkers);
  };

  // 일정에 추가하는 함수 (위치 포함)
  const addPlanToDay = (plan) => {
    setSelectedPlans((prevPlans) => [...prevPlans, plan]);
  };

  // 기차편 검색 처리 함수
  const handleTrainSearch = () => {
    if (trainDeparture.length >= 2 && trainArrival.length >= 2) {
      axios
        .get(`${backServer}/domestic/search`, {
          params: {
            departure: trainDeparture,
            arrival: trainArrival,
            apiKey: trainApiKey,
          },
        })
        .then((res) => {
          setTrainSchedules(res.data); // 기차 시간 리스트 업데이트
        })
        .catch((error) => {
          console.error("기차편 검색에 실패했습니다:", error);
        });
    } else {
      alert("출발지와 도착지를 입력해주세요.");
    }
  };

  return (
    <div className="schedule-wrap">
      <div className="content">
        <div className="itinerary-panel">
          <div className="schedule-plan">
            <SchedulePlanList
              itinerary={itinerary}
              totalPlanDates={totalPlanDates}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              planPageOption={planPageOption}
              setPlanPageOption={setPlanPageOption}
              selectedPlans={selectedPlans} // 선택된 일정 전달
            />
          </div>
        </div>
        <div className="store-list" style={{ width: "300px" }}>
          <div className="search-button">
            <button
              className="tri-date"
              onClick={() => setShowTrainSearch(!showTrainSearch)}
            >
              기차편 추가
            </button>
            <button
              className="date-list"
              onClick={() => setShowSearch(!showSearch)}
            >
              일정 추가
            </button>
          </div>
          {showTrainSearch && (
            <div className="train-search-container">
              <div className="train-inputs">
                <input
                  type="text"
                  placeholder="출발지"
                  value={trainDeparture}
                  onChange={(e) => setTrainDeparture(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="도착지"
                  value={trainArrival}
                  onChange={(e) => setTrainArrival(e.target.value)}
                />
              </div>
              <button className="train-search-btn" onClick={handleTrainSearch}>
                검색
              </button>

              <div className="train-search-list-box">
                {trainSchedules.length > 0 ? (
                  <ul>
                    {trainSchedules.map((schedule, index) => (
                      <li key={index}>
                        <div className="train-schedule-box">
                          <p>
                            출발: {schedule.departureTime} - 도착:{" "}
                            {schedule.arrivalTime}
                          </p>
                          <p>
                            {schedule.trainName} ({schedule.trainType})
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>검색된 기차편이 없습니다.</p>
                )}
              </div>
            </div>
          )}

          {showSearch && (
            <div className="search-container">
              <input
                type="text"
                placeholder="장소 검색"
                onChange={handleSearch}
              />
              <button className="search-add">검색</button>
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index}>
                    {result.name} - {result.formattedAddress}
                    <button
                      className="add-btn"
                      onClick={() =>
                        addPlanToDay({
                          name: result.name,
                          address: result.formattedAddress,
                        })
                      }
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="map-container">
          <div id="map" style={{ height: "100%", width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
