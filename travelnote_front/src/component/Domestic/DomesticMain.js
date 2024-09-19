import { useState } from "react";
import "./DomesticMain.css";
import { Link } from "react-router-dom";

const DomesticMain = () => {
  const [regionList] = useState([
    { city: "서울", imageUrl: "images/서울.jpg" },
    { city: "부산", imageUrl: "images/부산.jpg" },
    { city: "대구", imageUrl: "images/대구.jpg" },
    { city: "인천", imageUrl: "images/인천.jpg" },
    { city: "광주", imageUrl: "images/광주.jpg" },
    { city: "대전", imageUrl: "images/대전.jpg" },
    { city: "제주", imageUrl: "images/제주.jpg" },
  ]);

  const [searchText, setSearchText] = useState("어디로 갈까요 ?");
  const [filteredRegions, setFilteredRegions] = useState(regionList); // 초기값으로 모든 지역 설정

  const handleFocus = () => {
    if (searchText === "어디로 갈까요 ?") {
      setSearchText("");
    }
  };

  const handleBlur = () => {
    if (searchText === "") {
      setSearchText("어디로 갈까요 ?");
    }
  };

  // 검색 버튼 클릭 시 호출되는 함수
  const handleSearch = () => {
    if (searchText === "어디로 갈까요 ?" || searchText === "") {
      // 텍스트가 비어있거나 기본 텍스트일 경우 검색 하기 전 화면으로 돌아간다
      setFilteredRegions(regionList);
    } else {
      const results = regionList.filter((region) =>
        region.city.includes(searchText)
      );
      setFilteredRegions(results);
    }
  };

  return (
    <div className="domestic-wrap">
      <h1>국내 여행 플레너</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          검색
        </button>
      </div>

      <div className="city-list">
        {filteredRegions.map((region, index) => (
          <CityCard key={index} city={region.city} imageUrl={region.imageUrl} />
        ))}
      </div>
      <button className="more-btn">더보기</button>
    </div>
  );
};

const CityCard = ({ city, imageUrl }) => {
  return (
    <div className="city-card" tabIndex={0}>
      <Link to={`/city/${city}`}>
        <img src={imageUrl} alt={city} className="city-image" />
        <div className="city-name">{city}</div>
      </Link>
    </div>
  );
};

export default DomesticMain;
