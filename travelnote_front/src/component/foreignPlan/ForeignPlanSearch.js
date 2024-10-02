import { useEffect, useState } from "react";
import ForeignPlaceItem from "./ForeignPlaceItem";
import axios from "axios";
import ForeignAirportItem from "./ForeignAirportItem";

const ForeignPlanSearch = (props) => {
  const {
    itineraryNo,
    searchInput,
    setSearchInput,
    setSearchKeyword,
    searchPlaceList,
    setSearchPlaceList,
    selectedPosition,
    setSelectedPosition,
    setPlaceInfo,
    selectedDay,
    planList,
    setPlanList,
    backServer,
    totalPlanDates,
    setIsPlanAdded,
    departInfo,
    setDepartInfo,
    arrivalInfo,
    setArrivalInfo,
    timeOptionsArr,
    isNextDayButtonChecked,
    setIsNextDayButtonChecked,
  } = props;
  const [category, setCategory] = useState(1); // 1일 때 항공편, 2일 때 장소

  // 추천 명소로 저장된 정보 목록 조회

  // 장소 검색 인풋에 엔터 입력 시 검색
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

  // 출발 항공편 인풋 핸들러
  const changeDepartInfo = (e) => {
    setDepartInfo({ ...departInfo, [e.target.id]: e.target.value });
  };

  // 도착 항공편 인풋 핸들러
  const changeArrivalInfo = (e) => {
    setArrivalInfo({ ...arrivalInfo, [e.target.id]: e.target.value });
  };

  // 항공편 검색
  const addFlightInfo = () => {
    console.log(1);
  };

  return (
    <div className="plan-search-wrap">
      <div className="category-button-box">
        <ul className="category-button-ul">
          <li
            className={category === 1 ? "selected" : ""}
            onClick={() => {
              setCategory(1);
              setSearchPlaceList([]);
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
        <FlightInputBox
          selectedDay={selectedDay}
          totalPlanDates={totalPlanDates}
          itineraryNo={itineraryNo}
          backServer={backServer}
          setIsPlanAdded={setIsPlanAdded}
          departInfo={departInfo}
          setDepartInfo={setDepartInfo}
          arrivalInfo={arrivalInfo}
          setArrivalInfo={setArrivalInfo}
          changeDepartInfo={changeDepartInfo}
          changeArrivalInfo={changeArrivalInfo}
          addFlightInfo={addFlightInfo}
          timeOptionsArr={timeOptionsArr}
          isNextDayButtonChecked={isNextDayButtonChecked}
          setIsNextDayButtonChecked={setIsNextDayButtonChecked}
          searchPlaceList={searchPlaceList}
          setSelectedPosition={setSelectedPosition}
          setPlaceInfo={setPlaceInfo}
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
const FlightInputBox = (props) => {
  const {
    selectedDay,
    totalPlanDates,
    itineraryNo,
    backServer,
    setIsPlanAdded,
    addFlightInfo,
    timeOptionsArr,
    isNextDayButtonChecked,
    setIsNextDayButtonChecked,
    searchPlaceList,
    departInfo,
    setDepartInfo,
    arrivalInfo,
    setArrivalInfo,
    changeDepartInfo,
    changeArrivalInfo,
    setSelectedPosition,
    setPlaceInfo,
  } = props;

  return (
    <div className="flight-info-form">
      <div className="flight-input-box">
        <h4>출발 공항</h4>
        <input
          id="departAirport"
          placeholder="출발 공항을 입력해 주세요."
          value={departInfo.departAirport}
          onChange={changeDepartInfo}
          onKeyUp={changeDepartInfo}
        ></input>
      </div>
      <div className="flight-input-box">
        <h4>도착 공항</h4>
        <input
          id="arrivalAirport"
          placeholder="도착 공항을 입력해 주세요."
          value={arrivalInfo.arrivalAirport}
          onChange={setArrivalInfo}
          onKeyUp={setArrivalInfo}
        ></input>
      </div>
      <div className="flight-input-box">
        <h4>출발 시간</h4>
        <div className="flight-time">
          <select
            id="departTime"
            onClick={changeDepartInfo}
            key={departInfo.departTime}
            defaultValue={departInfo.departTime}
          >
            {timeOptionsArr.map((time, index) => {
              return (
                <option key={"time-option-" + index} value={time}>
                  {time}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="flight-input-box">
        <h4>도착 시간</h4>
        <div className="flight-time">
          <select
            id="arrivalTime"
            onClick={changeArrivalInfo}
            key={arrivalInfo.arrivalTime}
            defaultValue={arrivalInfo.arrivalTime}
          >
            {timeOptionsArr.map((time, index) => {
              return (
                <option key={"time-option-" + index} value={time}>
                  {time}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="flight-input-box next-day-checkbox">
        <div>
          <label className="next-day-check">
            <input
              id="next-day-check"
              name="arriveNextDay"
              type="checkbox"
              checked={isNextDayButtonChecked}
              onChange={() => {
                setIsNextDayButtonChecked(!isNextDayButtonChecked);
              }}
            ></input>
            <div>
              <p>익일 도착</p>
            </div>
            <div
              className={
                "check-icon" + (isNextDayButtonChecked ? " icon-checked" : "")
              }
            >
              <span className="material-icons">done</span>
            </div>
          </label>
        </div>
      </div>
      <div className="airport-list-box">
        <div className="airport-list">
          {searchPlaceList.map((place, index) => {
            return (
              <ForeignAirportItem
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
          })}
        </div>
      </div>
      <div className="flight-submit-box">
        <button onClick={addFlightInfo} id="flight-submit-button">
          일정에 추가하기
        </button>
      </div>
    </div>
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
            <h5>장소 정보가 없어요.</h5>
          )}
        </div>
      </div>
    </>
  );
};

export default ForeignPlanSearch;
