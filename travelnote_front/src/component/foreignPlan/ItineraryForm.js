import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { getMonth, getDate, getDay, getYear } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";

// path: foreign/createItinerary/:regionNo
const ItineraryForm = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();
  const regionNo = useParams().regionNo;
  const [region, setRegion] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itineraryTitle, setItineraryTitle] = useState("");
  const [itineraryStartDate, setItineraryStartDate] = useState("");
  const [itineraryEndDate, setItineraryEndDate] = useState("");

  // 지역 정보 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/regionInfo/${regionNo}`)
      .then((res) => {
        setRegion(res.data);
      })
      .catch((err) => {});
  }, []);

  // 여행 제목 변경 핸들러
  const changeInput = (e) => {
    const userInput = e.target.value.trim();
    if (userInput === "") {
      setItineraryTitle("");
    } else {
      setItineraryTitle(e.target.value);
    }
  };

  // 날짜 변경 핸들러
  const changeStartDate = (e) => {
    setStartDate(e);

    const year = getYear(e);
    const month = String(getMonth(e) + 1).padStart(2, "0");
    const date = String(getDate(e)).padStart(2, "0");

    setItineraryStartDate(year + "-" + month + "-" + date);
  };
  const changeEndDate = (e) => {
    setEndDate(e);

    const year = getYear(e);
    const month = String(getMonth(e) + 1).padStart(2, "0");
    const date = String(getDate(e)).padStart(2, "0");

    setItineraryEndDate(year + "-" + month + "-" + date);
  };

  // 새 일정 생성
  const createItinerary = () => {
    if (startDate !== "" && endDate !== "") {
      const obj = {};
      obj.userEmail = loginEmail;
      obj.regionNo = regionNo;
      obj.itineraryStartDate = itineraryStartDate;
      obj.itineraryEndDate = itineraryEndDate;
      if (itineraryTitle === "") {
        obj.itineraryTitle = `${region.regionName}에 갑니다!`;
      } else {
        obj.itineraryTitle = itineraryTitle.trim();
      }
      axios
        .post(`${backServer}/foreign/createItinerary`, obj)
        .then((res) => {
          const itineraryNo = res.data;
          // 성공 시 조회 화면으로 이동
          if (itineraryNo > 0) {
            navigate(`/foreign/plan/${itineraryNo}`);
          } else {
            Swal.fire({
              icon: "error",
              text: "처리 중 오류가 발생했습니다.",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            text: "서버 오류입니다.",
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        text: "날짜를 입력해 주세요.",
      });
    }
  };

  return (
    <section className="section">
      <form
        className="itinerary-form"
        onSubmit={(e) => {
          e.preventDefault();
          createItinerary();
        }}
      >
        {/* 여행지 정보 */}
        <div className="foreign-info-box">
          <h2>
            {region.countryName} {region.regionName}
          </h2>
          <div className="region-info-box">
            <span id="currency-info">
              {region.currencyCode ? (
                <>
                  <span class="material-icons">credit_card</span>
                  <span> </span>
                  {region.currencyCode}
                </>
              ) : (
                "환율 정보 없음"
              )}
            </span>
            <span id="timezone-info">
              {region.timeZone ? (
                <>
                  <span class="material-icons">schedule</span>
                  <span> </span>
                  {region.timeZone} 시간
                </>
              ) : (
                "시차 정보 없음"
              )}
            </span>
          </div>
        </div>

        {/* 이미지, 인풋 3개 */}
        <div className="foregin-itinerary-box">
          <div className="region-img">
            <img
              src={
                region.regionImg !== ""
                  ? `${backServer}/foreignImg/${region.regionImg}`
                  : "/image/default_img.png"
              }
            ></img>
          </div>
          <div className="itinerary-input-box">
            <div className="itinerary-input-item">
              <p>여행 제목</p>
              <input
                className="itinerary-input"
                name="itineraryTitle"
                value={itineraryTitle}
                onChange={changeInput}
                placeholder={region.regionName + "에 갑니다!"}
              ></input>
            </div>
            <div className="itinerary-input-item">
              <p>시작 날짜</p>
              <DatePicker
                className="itinerary-input"
                name="startDate"
                selected={startDate}
                dateFormat="YYYY년 MM월 dd일"
                onChange={changeStartDate}
                maxDate={endDate}
                locale={ko}
              />
            </div>
            <div className="itinerary-input-item">
              <p>종료 날짜</p>
              <DatePicker
                className="itinerary-input"
                name="endDate"
                selected={endDate}
                dateFormat="YYYY년 MM월 dd일"
                onChange={changeEndDate}
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
