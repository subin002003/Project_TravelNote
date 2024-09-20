import { useParams } from "react-router-dom";
import "./CityDetail.css";

const CityDetail = () => {
  const { cityName } = useParams();
  return (
    <div className="city-detail">
      <div className="detail-content">
        <h1>{cityName}</h1>
        <img
          src={`/images/${cityName}.jpg`}
          alt={cityName}
          className="city-detail-image"
        />
        <form className="trip-form">
          <label>
            여행 제목 입력 :
            <input type="text" placeholder="여행 제목을 입력해주세요" />
          </label>
          <div className="date-inputs">
            <label>
              여행 시작 날짜:
              <input type="date" />
            </label>
            <label>
              여행 종료 날짜:
              <input type="date" />
            </label>
          </div>
          <button className="trip-btn">여행 일정 만들기</button>
        </form>
      </div>
    </div>
  );
};

export default CityDetail;
