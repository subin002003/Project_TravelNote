import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  loginEmailState,
  userTypeState,
} from "../utils/RecoilData";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDate, getMonth, getYear } from "date-fns";
import ForeignPlanList from "./ForeignPlanList";
import ForeignPlanSearch from "./ForeignPlanSearch";
import ForeignRegionInfo from "./ForeignRegionInfo";

// path: foreign/plan/:itineraryNo
const ForeignPlanMain = () => {
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
  const [selectedDay, setSelectedDay] = useState(1); // 현재 조회 중인 날 (기본 1로 세팅)
  const [planPageOption, setPlanPageOption] = useState(1); // 조회 페이지 옵션 (1 조회, 2 수정)

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

  return (
    <div className="plan-view-wrap">
      <ForeignPlanList
        itinerary={itinerary}
        planDays={planDays}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        totalPlanDates={totalPlanDates}
        planPageOption={planPageOption}
        setPlanPageOption={setPlanPageOption}
      />
      {planPageOption === 1 ? (
        <ForeignRegionInfo itineraryNo={itineraryNo} />
      ) : (
        <ForeignPlanSearch itineraryNo={itineraryNo} />
      )}

      <div className="plan-map-wrap">3</div>
    </div>
  );
};

export default ForeignPlanMain;
