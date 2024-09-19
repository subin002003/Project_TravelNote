import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

const ItineraryForm = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const regionNo = useParams().regionNo;
  const [region, setRegion] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itineraryTitle, setItineraryTitle] = useState("");

  // 지역 정보 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/view/${regionNo}`)
      .then((res) => {
        setRegion(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 새 일정 생성

  return (
    <section className="section">
      <form
        className="itinerary-form"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {/* 여행지 정보 */}
        <div className="foreign-info-box">
          <h2>
            국가명 지역명
            {region.countryName} {region.regionName}
          </h2>
          <div className="region-info-box">
            <span id="currency-info">
              {region.currencyCode ? region.currencyCode : "환율 정보 없음"}
            </span>
            <span id="timezone-info">
              {region.timeZone ? region.timeZone : "시차 정보 없음"}
            </span>
          </div>
        </div>

        {/* 이미지, 인풋 3개 */}
        <div className="foregin-itinerary-box">
          <div className="region-img">
            <img
              src={
                region.regionImg
                  ? `${backServer}/foreign/${region.regionImg}`
                  : "/image/default_img.png"
              }
            ></img>
          </div>
          <div className="itinerary-input-box">
            <div className="itinerary-input-item">
              <p>여행 제목</p>
              <input
                id="itinerary-input"
                name="itineraryTitle"
                value={itineraryTitle}
                onChange={(e) => {
                  setItineraryTitle(e.target.value);
                }}
                placeholder="여행 제목을 입력해 주세요."
              ></input>
            </div>
            <div className="itinerary-input-item">
              <p>시작 날짜</p>
              <DatePicker
                id="itinerary-input"
                name="startDate"
                selected={startDate}
                dateFormat="YYYY년 MM월 dd일"
                onChange={(date) => {
                  setStartDate(date);
                }}
                maxDate={endDate}
                locale={ko}
              />
            </div>
            <div className="itinerary-input-item">
              <p>종료 날짜</p>
              <DatePicker
                id="itinerary-input"
                name="endDate"
                selected={endDate}
                dateFormat="YYYY년 MM월 dd일"
                onChange={(date) => {
                  setEndDate(date);
                }}
                minDate={startDate}
                locale={ko}
              />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="create-button-box">
          <button id="itinerary-create-button" type="submit">
            여행 일정 만들기
          </button>
        </div>
      </form>
    </section>
  );
};

export default ItineraryForm;
