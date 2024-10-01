import { useState } from "react";
import ForeignPlaceItem from "./ForeignPlaceItem";
import axios from "axios";
import FlightItem from "./FlightItem";

const ForeignPlanSearch = (props) => {
  const flightsApiKey = process.env.REACT_APP_FLIGHTS_API_KEY;
  const {
    itineraryNo,
    searchInput,
    setSearchInput,
    setSearchKeyword,
    searchPlaceList,
    selectedPosition,
    setSelectedPosition,
    setPlaceInfo,
    selectedDay,
    planList,
    setPlanList,
    backServer,
    totalPlanDates,
    setIsPlanAdded,
    searchAirport,
    setSearchAirport,
    searchFlightList,
    setSearchFlightList,
  } = props;
  const [category, setCategory] = useState(1); // 1일 때 항공편, 2일 때 장소

  // 추천 명소로 저장된 정보 목록 조회

  // 인풋에 엔터 입력 시 검색
  const changeSearchInput = (e) => {
    setSearchInput(e.target.value);
    if (e.keyCode === 13) {
      document.getElementById("place-search-button").click();
    }
  };

  // 버튼 클릭 시 검색
  const search = () => {
    if (searchInput.trim() === "") return;
    setSearchKeyword(searchInput.trim());
  };

  // 공항 검색 인풋 핸들러
  const changeSearchAirport = (e) => {
    setSearchAirport({ ...searchAirport, [e.target.id]: e.target.value });
    if (e.keyCode === 13) {
      document.getElementById("flight-search-button").click();
    }
  };

  // 항공편 검색
  const searchFlights = () => {
    axios
      .get(`${backServer}/flightsApi/getFlights`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="plan-search-wrap">
      <div className="category-button-box">
        <ul className="category-button-ul">
          <li
            className={category === 1 ? "selected" : ""}
            onClick={() => {
              setCategory(1);
            }}
          >
            항공편 추가
          </li>
          <li
            className={category === 2 ? "selected" : ""}
            onClick={() => {
              setCategory(2);
            }}
          >
            일정 추가
          </li>
        </ul>
      </div>
      {category === 1 ? (
        <FlightSearchBox
          selectedDay={selectedDay}
          totalPlanDates={totalPlanDates}
          itineraryNo={itineraryNo}
          backServer={backServer}
          setIsPlanAdded={setIsPlanAdded}
          searchAirport={searchAirport}
          setSearchAirport={setSearchAirport}
          searchFlightList={searchFlightList}
          setSearchFlightList={setSearchFlightList}
          changeSearchAirport={changeSearchAirport}
          searchFlights={searchFlights}
        />
      ) : (
        <PlaceSearchBox
          searchInput={searchInput}
          changeSearchInput={changeSearchInput}
          search={search}
          searchPlaceList={searchPlaceList}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          setPlaceInfo={setPlaceInfo}
          selectedDay={selectedDay}
          itineraryNo={itineraryNo}
          planList={planList}
          setPlanList={setPlanList}
          backServer={backServer}
          totalPlanDates={totalPlanDates}
          setIsPlanAdded={setIsPlanAdded}
        />
      )}
    </div>
  );
};

// category가 1일 때 (항공편 관련)
const FlightSearchBox = (props) => {
  const {
    selectedDay,
    totalPlanDates,
    itineraryNo,
    backServer,
    setIsPlanAdded,
    searchAirport,
    setSearchAirport,
    searchFlightList,
    setSearchFlightList,
    changeSearchAirport,
    searchFlights,
  } = props;

  return (
    <>
      <div className="flight-search-box">
        <input
          id="departure"
          placeholder="출발 공항을 입력해 주세요."
          value={searchAirport.departure}
          onChange={changeSearchAirport}
          onKeyUp={changeSearchAirport}
        ></input>
        <input
          id="arrival"
          placeholder="도착 공항을 입력해 주세요."
          value={searchAirport.arrival}
          onChange={changeSearchAirport}
          onKeyUp={changeSearchAirport}
        ></input>
      </div>
      <div className="flight-search-box">
        <button onClick={searchFlights} id="flight-search-button">
          검색
        </button>
      </div>
      <div className="flight-list-box">
        <div className="flight-list">
          {searchFlightList.length > 0 ? (
            searchFlightList.map((flight, index) => {
              return (
                <FlightItem
                  key={"foreign-flight-item-" + index}
                  flight={flight}
                  index={index}
                  selectedDay={selectedDay}
                  totalPlanDates={totalPlanDates}
                  itineraryNo={itineraryNo}
                  backServer={backServer}
                  setIsPlanAdded={setIsPlanAdded}
                />
              );
            })
          ) : (
            <h5>일치하는 여정을 찾을 수 없어요.</h5>
          )}
        </div>
      </div>
    </>
  );
};

// category가 2일 때 (장소 관련)
const PlaceSearchBox = (props) => {
  const {
    searchInput,
    changeSearchInput,
    search,
    searchPlaceList,
    setSelectedPosition,
    setPlaceInfo,
    selectedDay,
    itineraryNo,
    backServer,
    totalPlanDates,
    setIsPlanAdded,
  } = props;

  return (
    <>
      <div className="place-search-box">
        <input
          placeholder="검색어를 입력해 주세요."
          value={searchInput}
          onChange={changeSearchInput}
          onKeyUp={changeSearchInput}
        ></input>
        <button onClick={search} id="place-search-button">
          검색
        </button>
      </div>
      <div className="place-list-box">
        <div className="place-list">
          {searchPlaceList.length > 0 ? (
            searchPlaceList.map((place, index) => {
              return (
                <ForeignPlaceItem
                  key={"foreign-place-item-" + index}
                  place={place}
                  setSelectedPosition={setSelectedPosition}
                  setPlaceInfo={setPlaceInfo}
                  itineraryNo={itineraryNo}
                  selectedDay={selectedDay}
                  backServer={backServer}
                  totalPlanDates={totalPlanDates}
                  setIsPlanAdded={setIsPlanAdded}
                />
              );
            })
          ) : (
            <h5>등록된 추천 장소가 없어요.</h5>
          )}
        </div>
      </div>
    </>
  );
};

export default ForeignPlanSearch;
