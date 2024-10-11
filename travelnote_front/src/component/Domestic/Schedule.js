import React, { useEffect, useState } from "react";
import "./Schedule.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getDate, getMonth, getYear } from "date-fns";
import SchedulePlanList from "./SchedulePlanList";
import Swal from "sweetalert2";

const Schedule = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [plans, setPlans] = useState([]); // 사용자의 계획 리스트
  const [selectedDay, setSelectedDay] = useState(1);
  const [planPageOption, setPlanPageOption] = useState(1);
  const [map, setMap] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const [totalPlanDates, setTotalPlanDates] = useState([]);
  const [cityCoordinates, setCityCoordinates] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const [planDay, setPlanDay] = useState(1); // planDay 초기값 설정
  const [showSearch, setShowSearch] = useState(false);
  const [showTrainSearch, setShowTrainSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { itineraryNo, city } = useParams();
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [planList, setPlanList] = useState(false);
  const [planse, setPlanse] = useState(true);

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
      });
  }, [backServer, itineraryNo, planse]);

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
  }, [googleMapsApiKey]);

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
    if (map && cityCoordinates) {
      map.panTo(cityCoordinates); // 지도의 중심을 새 좌표로 이동
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
        fields: ["name", "geometry", "place_id", "formatted_address"],
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
          setSearchResults([]);
          updateMarkers([]);
        }
      });
    } else {
      setSearchResults([]);
      updateMarkers([]);
    }
  };

  // 마커 업데이트
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

  // 일정 추가 함수
  const handleAddPlan = (plan) => {
    const SchedulePlan = {
      itineraryNo: itineraryNo,
      planDay: selectedDay,
      planDate: totalPlanDates[selectedDay - 1],
      planAddress: plan.formattedAddress,
      planLatitude: plan.geometry.location.lat(),
      planLongitude: plan.geometry.location.lng(),
      planType: 1,
      planName: plan.name,
      planId: plan.place_id,
    };
    axios
      .post(`${backServer}/domestic/insertPlan`, SchedulePlan)
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({
            title: "일정 추가 성공!",
            text: "장소가 일정에 추가되었습니다.",
            icon: "success",
          });
          if (map) {
            map.panTo({
              lat: plan.geometry.location.lat(),
              lng: plan.geometry.location.lng(),
            });
          }
          setPlanse(planse ? false : true);
        }
      });
  };

  // 검색 기능 표시 토글
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
              setPlanList={setPlanList}
              plans={plans}
            />
          </div>
        </div>
        <div className="store-list">
          <div className="search-button">
            <button className="date-list" onClick={togglePlaceSearch}>
              일정 추가
            </button>
          </div>
          {showSearch && (
            <div className="search-container">
              <input
                type="text"
                placeholder="장소 검색"
                onChange={handleSearch}
              />
              <button className="search-add">검색</button>
              <ul>
                {searchResults.map((result) => (
                  <li key={result.place_id}>
                    {result.name} - {result.formattedAddress}
                    <button
                      className="add-btn"
                      onClick={() => handleAddPlan(result)}
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div id="map" style={{ height: "80%", width: "70%" }}></div>
      </div>
    </div>
  );
};

export default Schedule;
