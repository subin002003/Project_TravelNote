import { useNavigate } from "react-router-dom";
import ForeignPlanDaysButton from "./ForeignPlanDaysButton";

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

  const navigate = useNavigate();
  const selectedDate = totalPlanDates[selectedDay - 1];

  return (
    <div className="plan-list-wrap">
      <div className="itinerary-info-box">
        <h4>{itinerary.itineraryTitle}</h4>
        <h4>
          {itinerary.countryName} {itinerary.regionName}
        </h4>
        <h5>
          {itinerary.itineraryStartDate} ~ {itinerary.itineraryEndDate}
        </h5>
        <button className="edit-itinerary-button" type="button">
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
      </div>
      <div className="daily-plan-list-box">
        <h5>{selectedDate}</h5>
      </div>
    </div>
  );
};

export default ForeignPlanList;
