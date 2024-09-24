import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDate, getDay, getMonth, getYear } from "date-fns";
import ForeignPlanDaysButton from "./ForeignPlanDaysButton";

const ForeignPlanView = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [loginEmail, setLoginEmail] = useRecoilState(loginEmailState);
  const [userType, setUserType] = useRecoilState(userTypeState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();
  const itineraryNo = useParams().itineraryNo; // 여행 일정 번호
  const [itinerary, setItinerary] = useState({}); // 여행 일정 정보 객체
  const [totalPlanDates, setTotalPlanDates] = useState([]); // 여행 일정표 용 날짜 배열
  const [planDays, setPlanDays] = useState([]); // 현재 조회 중인 날 기준으로 보여주는 날짜 배열
  const [planList, setPlanList] = useState([]); // 해당 날짜의 일정 배열
  const [selectedDay, setSelectedDay] = useState(10); // 현재 조회 중인 날

  // 일정 정보 조회
  useEffect(() => {
    axios
      .get(`${backServer}/foreign/getItineraryInfo/${itineraryNo}`)
      .then((res) => {
        if (res.data) {
          setItinerary(res.data);

          // 날짜 배열 생성
          const startDate = new Date(res.data.itineraryStartDate);
          const endDate = new Date(res.data.itineraryEndDate);
          while (startDate <= endDate) {
            const year = getYear(startDate);
            const month = String(getMonth(startDate) + 1).padStart(2, "0");
            const date = String(getDate(startDate)).padStart(2, "0");
            const newDate = year + "-" + month + "-" + date;
            totalPlanDates.push(newDate);
            startDate.setDate(startDate.getDate() + 1);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 일정 수정으로 이동
  const editItinerary = () => {
    navigate(`/foreign/editItinerary/${itineraryNo}`);
  };

  return (
    <div className="plan-view-wrap">
      {/* 첫 번째 세로 칸 */}
      <div className="plan-list-wrap">
        <div className="itinerary-info-box">
          <h4>
            {itinerary.countryName} {itinerary.regionName}
          </h4>
          <h5>
            {itinerary.itineraryStartDate} ~ {itinerary.itineraryEndDate}
          </h5>
          <button
            className="edit-itinerary-button"
            type="button"
            onClick={editItinerary}
          >
            이 여행 관리
          </button>
        </div>
        <div className="daily-plan-box">
          <ForeignPlanDaysButton
            planDays={planDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            totalPlanDates={totalPlanDates}
          />
          <ul className="plan-dates-list"></ul>
        </div>
      </div>

      {/* 두 번째 세로 칸 */}
      <div className="plan-detail-wrap">2</div>

      {/* 세 번째 세로 칸 (지도) */}
      <div className="plan-map-wrap">3</div>
    </div>
  );
};

export default ForeignPlanView;
