import { useState } from "react";
import "./DomesticMain.css";
import { Link } from "react-router-dom";

const DomesticMain = () => {
  const [regionList] = useState([
    { city: "서울", imageUrl: "images/default_img.png" },
    { city: "부산", imageUrl: "images/default_img.png" },
    { city: "대구", imageUrl: "images/default_img.png" },
    { city: "인천", imageUrl: "images/default_img.png" },
    { city: "광주", imageUrl: "images/default_img.png" },
    { city: "대전", imageUrl: "images/default_img.png" },
  ]);

  const [searchText, setSearchText] = useState("어디로 갈까요 ?");

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
        <button className="search-btn">검색</button>
      </div>

      <div className="city-list">
        {regionList.map((region, index) => (
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
