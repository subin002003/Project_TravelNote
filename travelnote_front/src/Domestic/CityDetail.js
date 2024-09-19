import { useParams } from "react-router-dom";
import "./CityDetail.css";
const CityDetail = () => {
  const { cityName } = useParams(); // URL에서 도시 이름을 가져옴
  return (
    <div className="city-detail">
      <div className="detail-content">
        <h2>{cityName}</h2>
        <img
          src={`url to=${cityName}images`}
          alt={cityName}
          className="city-detail-image"
        />
        <form className="trip-form">
          <input type="text" placeholder="여행 제목을 입력해주세요" />

          <button className="create-trip-btn">여행 일정 만들기</button>
        </form>
      </div>
    </div>
  );
};
export default CityDetail;
