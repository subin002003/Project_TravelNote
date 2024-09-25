import { Link, useNavigate } from "react-router-dom";
import ForeignPlanDaysButton from "./ForeignPlanDaysButton";
import { useEffect, useState } from "react";
import PlanItem from "./PlanItem";
import axios from "axios";

const ForeignPlanList = (props) => {
  const {
    itinerary,
    planDays,
    selectedDay,
    setSelectedDay,
    totalPlanDates,
    planPageOption,
    setPlanPageOption,
  } = props;

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const selectedDate = totalPlanDates[selectedDay - 1];
  const [planList, setPlanList] = useState([]); // 조회 중인 일정 목록 배열

  useEffect(() => {
    if (itinerary.itineraryNo > 0) {
      axios
        .get(`${backServer}/foreign/getPlanList`, {
          params: {
            itineraryNo: itinerary.itineraryNo,
            planDay: selectedDay,
          },
        })
        .then((res) => {
          console.log(res);
          setPlanList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [itinerary, selectedDate]);

  return (
    <div className="plan-list-wrap">
      <div className="itinerary-info-box">
        <h4>{itinerary.itineraryTitle}</h4>
        <h5>
          {itinerary.countryName} {itinerary.regionName}
        </h5>
        <h5>
          {itinerary.itineraryStartDate} ~ {itinerary.itineraryEndDate}
        </h5>
        <Link className="edit-itinerary-button">이 여행 수정하기</Link>
      </div>
      <div className="daily-plan-box">
        <ForeignPlanDaysButton
          planDays={planDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          totalPlanDates={totalPlanDates}
        />
      </div>
      <div className="daily-plan-list-box">
        <h5>{selectedDate}</h5>
        <div className="daily-plan-list">
          <PlanItem
            itineraryNo={itinerary.itineraryNo}
            selectedDay={selectedDay}
            planList={planList}
            setPlanList={setPlanList}
          />
        </div>
      </div>
      {/* planPageOption에 따라 저장인지, 수정인지 버튼 */}
    </div>
  );
};

export default ForeignPlanList;
