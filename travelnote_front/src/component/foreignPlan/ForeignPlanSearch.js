import { useState } from "react";
import ForeignPlaceItem from "./ForeignPlaceItem";
import axios from "axios";

const ForeignPlanSearch = (props) => {
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
  } = props;
  const [category, setCategory] = useState(2); // 1이면 항공편, 2면 장소

  // 목록 조회

  const changeSearchInput = (e) => {
    setSearchInput(e.target.value);
    if (e.keyCode === 13) {
      document.getElementById("search-button").click();
    }
  };

  // 버튼 클릭 시 검색
  const search = () => {
    if (searchInput.trim() === "") return;
    setSearchKeyword(searchInput.trim());
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
        <FlightSearchBox />
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

// category가 1이면 항공편 관련
const FlightSearchBox = () => {
  return;
};

// category가 2이면 장소 관련
const PlaceSearchBox = (props) => {
  const {
    searchInput,
    changeSearchInput,
    search,
    searchPlaceList,
    selectedPosition,
    setSelectedPosition,
    setPlaceInfo,
    selectedDay,
    itineraryNo,
    planList,
    setPlanList,
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
        <button onClick={search} id="search-button">
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
                  index={index}
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
