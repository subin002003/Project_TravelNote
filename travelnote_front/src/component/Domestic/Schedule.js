import React, { useEffect, useState } from "react";
import "./Schedule.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getDate, getMonth, getYear } from "date-fns";
import SchedulePlanList from "./SchedulePlanList";

const Schedule = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const trainApiKey = process.env.REACT_APP_TRAIN_API_KEY;
  const [plans, setPlans] = useState([]); // 사용자의 계획 리스트
  const [planDays, setPlanDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [planPageOption, setPlanPageOption] = useState(1);
  const [map, setMap] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const [totalPlanDates, setTotalPlanDates] = useState([]);
  const [cityCoordinates, setCityCoordinates] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const [trainSchedules, setTrainSchedules] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showTrainSearch, setShowTrainSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [trainDeparture, setTrainDeparture] = useState("");
  const [trainArrival, setTrainArrival] = useState("");
  const { itineraryNo, city } = useParams();
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();

  // 일정 데이터 가져오기
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

  // Google Maps 초기화
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

  // 도시 좌표 설정
  useEffect(() => {
    const cityCoordinatesMap = {
      서울: { lat: 37.5665, lng: 126.978 },
      부산: { lat: 35.1796, lng: 129.0756 },
    };

    if (city && cityCoordinatesMap[city]) {
      setCityCoordinates(cityCoordinatesMap[city]);
    }
  }, [city]);

  // 도시 중심 변경
  useEffect(() => {
    if (map) {
      map.setCenter(cityCoordinates);
    }
  }, [map, cityCoordinates]);

  // 장소 검색
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
            photos: place.photos,
            place_id: place.place_id,
          }));
          setSearchResults(places);
          updateMarkers(places);
        } else {
          console.error("검색에 실패했습니다: ", status);
        }
      });
    } else {
      setSearchResults([]);
      updateMarkers([]);
    }
  };

  const updateMarkers = (places) => {
    markers.forEach((marker) => marker.setMap(null));

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
      marker.addListener("click", () => {
        infoWindow.setContent(
          `<div><strong>${place.name}</strong><br>${place.formattedAddress}</div>`
        );
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  useEffect(() => {
    console.log("Updated plans:", selectedPlans);
  }, [selectedPlans]);

  // 계획 추가 함수
  const planInsert = (plan) => {
    const SchedulePlan = {
      itineraryNo: itineraryNo,
      planDay: selectedDay,
      planDate: totalPlanDates[selectedDay - 1],
      planAddress: plan.formattedAddress,
      planLatitude: plan.geometry.location.lat(),
      planLongitude: plan.geometry.location.lng(),
      planImage: plan.photos[0]?.getUrl(),
      planType: 1,
      planName: plan.name,
      planId: plan.place_id,
    };
    axios
      .post(`${backServer}/domestic/insertPlan`, SchedulePlan)
      .then((response) => {
        console.log("일정이 추가되었습니다:", response.data);

        setPlans((prev) => [...prev, SchedulePlan]);
        setSelectedPlans((prev) => [...prev, SchedulePlan]); // 선택된 계획도 업데이트
      })
      .catch((error) => {
        console.error("일정 추가에 실패했습니다:", error);
      });
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
          setTrainSchedules(res.data);
        })
        .catch((error) => {
          console.error("기차편 검색에 실패했습니다:", error);
        });
    } else {
      alert("출발지와 도착지를 입력해주세요.");
    }
  };

  const toggleTrainSearch = () => {
    setShowTrainSearch(!showTrainSearch);
    setShowSearch(false);
  };

  const togglePlaceSearch = () => {
    setShowSearch(!showSearch);
    setShowTrainSearch(false);
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
              selectedPlans={selectedPlans}
              setSelectedPlans={setSelectedPlans}
              planInsert={planInsert}
              plans={plans}
            />
          </div>
        </div>
        <div className="store-list" style={{ width: "300px" }}>
          <div className="search-button">
            <button className="tri-date" onClick={toggleTrainSearch}>
              기차편 추가
            </button>
            <button className="date-list" onClick={togglePlaceSearch}>
              장소 검색
            </button>
          </div>
          {showTrainSearch && (
            <div className="train-search">
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
              <button onClick={handleTrainSearch}>기차 검색</button>
              <div>
                {trainSchedules.map((train, index) => (
                  <div key={index}>{train}</div>
                ))}
              </div>
            </div>
          )}
          {showSearch && (
            <div className="search-container">
              <input
                type="text"
                placeholder="장소 추가"
                onChange={handleSearch}
              />
              <ul>
                {selectedPlans.map((plan, index) => (
                  <li key={index}>{plan.planName}</li>
                ))}
              </ul>
              <button className="search-add">검색</button>
              <ul>
                {searchResults.map((result) => (
                  <li key={result.place_id}>
                    {result.name} - {result.formattedAddress}
                    <button
                      className="add-btn"
                      onClick={() => planInsert(result)}
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div id="map" style={{ height: "100%", width: "90%" }}></div>
      </div>
    </div>
  );
};

export default Schedule;
