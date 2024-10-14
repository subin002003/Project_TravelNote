import { useEffect, useState } from "react";
import ForeignPlaceItem from "./ForeignPlaceItem";
import axios from "axios";
import ForeignAirportItem from "./ForeignAirportItem";
import Swal from "sweetalert2";

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
    setIsPlanDiffered,
    departInfo,
    setDepartInfo,
    arrivalInfo,
    setArrivalInfo,
    timeOptionsArr,
    isNextDayButtonChecked,
    setIsNextDayButtonChecked,
    searchDepartAirport,
    setSearchDepartAirport,
    searchArrivalAirport,
    setSearchArrivalAirport,
    searchAirport,
    setSearchAirport,
    planPageOption,
  } = props;
  const [category, setCategory] = useState(2); // 1일 때 항공편, 2일 때 장소

  // 날짜, 카테고리, 수정 여부 변경 시 입력값 리셋
  useEffect(() => {
    setDepartInfo({ departAirport: "" });
    setArrivalInfo({ arrivalAirport: "" });
    setIsNextDayButtonChecked(false);
    setSearchDepartAirport();
    setSearchArrivalAirport();
    setSearchAirport();
    setSearchInput("");
    setSearchPlaceList([]);
  }, [selectedDay, category, planPageOption]);

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
    // e.keyCode가 13일 때 (엔터 쳤을 때) 검색 실행
    if (e.keyCode === 13) {
      setSearchDepartAirport(e.target.value);
      setSearchAirport(1);
    }
  };

  // 도착 항공편 인풋 핸들러
  const changeArrivalInfo = (e) => {
    setArrivalInfo({ ...arrivalInfo, [e.target.id]: e.target.value });
    // e.keyCode가 13일 때 (엔터 쳤을 때) 검색 실행
    if (e.keyCode === 13) {
      setSearchArrivalAirport(e.target.value);
      setSearchAirport(2);
    }
  };

  // 익일 도착 선택 버튼
  useEffect(() => {
    if (isNextDayButtonChecked) {
      setArrivalInfo({
        ...arrivalInfo,
        planDay: selectedDay + 1,
        planDate: totalPlanDates[selectedDay],
      });
    } else {
      setArrivalInfo({
        ...arrivalInfo,
        planDay: selectedDay,
        planDate: totalPlanDates[selectedDay - 1],
      });
    }
  }, [isNextDayButtonChecked]);

  // 입력값 확인
  const checkInput = () => {
    var warningType;
    var warningName;
    if (
      departInfo.planName &&
      departInfo.planTime &&
      arrivalInfo.planName &&
      arrivalInfo.planTime
    ) {
      return true;
    } else if (!departInfo.planName || !arrivalInfo.planName) {
      warningName = "공항";
      if (!departInfo.planName) {
        warningType = "출발";
      } else {
        warningType = "도착";
      }
    } else if (!departInfo.planTime || !arrivalInfo.planTime) {
      warningName = "시간";
      if (!departInfo.planTime) {
        warningType = "출발";
      } else if (!arrivalInfo.planTime) {
        warningType = "도착";
      }
    }
    Swal.fire({
      icon: "warning",
      text: warningType + " " + warningName + "을 설정해 주세요.",
    });
    return false;
  };

  // 시간 입력값 유효성 검사
  const checkTime = () => {
    const departTime = Number((departInfo.planTime + "").trim().slice(0, 2));
    const arrivalTime = Number((arrivalInfo.planTime + "").trim().slice(0, 2));
    if (departTime < arrivalTime) {
      return true;
    } else if (isNextDayButtonChecked) {
      return true;
    } else if (departTime === arrivalTime) {
      const departMin = Number((departInfo.planTime + "").trim().slice(3, 5));
      const arrivalMin = Number((arrivalInfo.planTime + "").trim().slice(3, 5));
      if (departMin < arrivalMin) {
        return true;
      } else if (departMin === arrivalMin) {
        Swal.fire({
          icon: "info",
          html: "출발 시간과 도착 시간이 동일합니다.<br>익일 도착인 경우 익일 도착을 체크해 주세요.",
        });
        return false;
      }
    }
    Swal.fire({
      icon: "info",
      html: "출발 시간이 도착 시간보다 느립니다.<br>익일 도착인 경우 익일 도착을 체크해 주세요.",
    });
    return false;
  };

  // 항공편 정보 저장
  const addFlightInfo = () => {
    if (!checkInput()) return;
    if (!checkTime()) return;
    const flightsInfo = [departInfo, arrivalInfo];
    axios
      .post(`${backServer}/foreign/addFlights`, flightsInfo)
      .then((res) => {
        if (res.data) {
          setIsPlanDiffered(true);
          setDepartInfo({ departAirport: "" });
          setArrivalInfo({ arrivalAirport: "" });
          setIsNextDayButtonChecked(false);
          setSearchDepartAirport("");
          setSearchArrivalAirport("");
          setSearchAirport("");
          Swal.fire({
            icon: "success",
            text: "항공편이 일정에 추가되었습니다.",
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          text: "서버 오류입니다.",
        });
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
              setSearchPlaceList([]);
            }}
          >
            항공편 추가
          </li>
          <li
            className={category === 2 ? "selected" : ""}
            onClick={() => {
              setCategory(2);
              setSearchPlaceList([]);
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
          setIsPlanDiffered={setIsPlanDiffered}
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
          searchAirport={searchAirport}
          setSearchAirport={setSearchAirport}
          setSearchPlaceList={setSearchPlaceList}
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
          setIsPlanDiffered={setIsPlanDiffered}
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
    setIsPlanDiffered,
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
    searchAirport,
    setSearchAirport,
    setSearchPlaceList,
  } = props;

  return (
    <div className="flight-info-form">
      <div className="flight-input-box">
        <h4>출발 시간</h4>
        <div className="flight-time">
          <select
            id="planTime"
            onClick={changeDepartInfo}
            key={departInfo.planTime}
            defaultValue={departInfo.planTime}
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
        <h4>출발 공항</h4>
        <input
          id="departAirport"
          placeholder="지도에서 출발 공항 찾기"
          value={departInfo.departAirport}
          onChange={changeDepartInfo}
          onKeyUp={changeDepartInfo}
        ></input>
      </div>
      <div className="flight-input-box">
        <h4>도착 시간</h4>
        <div className="flight-time">
          <select
            id="planTime"
            onClick={changeArrivalInfo}
            key={arrivalInfo.planTime}
            defaultValue={arrivalInfo.planTime}
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
        <h4>도착 공항</h4>
        <input
          id="arrivalAirport"
          placeholder="지도에서 도착 공항 찾기"
          value={arrivalInfo.arrivalAirport}
          onChange={changeArrivalInfo}
          onKeyUp={changeArrivalInfo}
        ></input>
      </div>

      <div className="flight-input-box next-day-checkbox">
        {selectedDay != totalPlanDates.length ? (
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
        ) : (
          ""
        )}
      </div>
      <div className="airport-list-box">
        {searchPlaceList.length > 0 ? (
          <div className="airport-list">
            <div className="airport-list-title">
              {searchAirport === 1
                ? "출발 공항 설정하기"
                : searchAirport === 2
                ? "도착 공항 설정하기"
                : ""}
            </div>
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
                  setIsPlanDiffered={setIsPlanDiffered}
                  departInfo={departInfo}
                  setDepartInfo={setDepartInfo}
                  arrivalInfo={arrivalInfo}
                  setArrivalInfo={setArrivalInfo}
                  searchAirport={searchAirport}
                  setSearchAirport={setSearchAirport}
                  setSearchPlaceList={setSearchPlaceList}
                />
              );
            })}
          </div>
        ) : (
          ""
        )}
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
    setIsPlanDiffered,
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
                  setIsPlanDiffered={setIsPlanDiffered}
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
