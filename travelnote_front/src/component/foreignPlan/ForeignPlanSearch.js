import { useState } from "react";
import ForeignPlaceItem from "./ForeignPlaceItem";
import axios from "axios";

const ForeignPlanSearch = (props) => {
  const { itineraryNo } = props;
  const [category, setCategory] = useState(2); // 1이면 항공편, 2면 장소
  const [searchInput, setSearchInput] = useState();
  const [placeList, setPlaceList] = useState([]);

  // 목록 조회

  // 버튼 클릭 시 검색
  const searchKeyword = () => {};

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
      <div className="plan-search-box">
        <input
          placeholder="검색어를 입력해 주세요."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        ></input>
        <button onClick={searchKeyword}>검색</button>
      </div>
      <div className="place-list-box">
        <div className="place-list">
          {placeList.length > 0 ? (
            placeList.map((place, index) => {
              return <ForeignPlaceItem place={place} index={index} />;
            })
          ) : (
            <h5>등록된 추천 장소가 없어요.</h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForeignPlanSearch;
