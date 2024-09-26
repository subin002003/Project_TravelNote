import { Link, useNavigate } from "react-router-dom";
import ForeignPlanDaysButton from "./ForeignPlanDaysButton";
import { useEffect, useState } from "react";
import axios from "axios";
import PlanItem from "./PlanItem";

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
  const [timeOptionsArr, setTimeOptionsArr] = useState([]); // 시간 선택 옵션 용 배열
  const [edited, setEdited] = useState(false);
  const [editPlanList, setEditPlanList] = useState([]); // 수정할 일정 목록

  // 일정 목록 조회
  useEffect(() => {
    if (itinerary.itineraryNo > 0) {
      setEditPlanList([]);
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

  // 시간 배열에 값 추가
  useEffect(() => {
    if (timeOptionsArr.length === 0) {
      for (let i = 0; i < 24; i++) {
        let time = "";
        if (i < 10) {
          time = "0" + i;
        } else {
          time = "" + i;
        }
        for (let j = 0; j < 60; j += 30) {
          let timeOption = "";
          if (j === 0) {
            timeOption += time + ":0" + j;
          } else {
            timeOption += time + ":" + j;
          }
          timeOptionsArr.push(timeOption);
          setTimeOptionsArr([...timeOptionsArr]);
        }
      }
    }
  }, []);

  // 일정 수정 버튼
  const editPlan = () => {
    if (edited) {
      const form = new FormData();
      form.append("editPlanList", editPlanList);
      axios
        .post(`${backServer}/foreign/editPlanInfo`, form)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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
        {totalPlanDates.length > 0 ? (
          <ForeignPlanDaysButton
            planDays={planDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            totalPlanDates={totalPlanDates}
          />
        ) : (
          ""
        )}
      </div>
      <div className="daily-plan-list-box">
        <h5>{selectedDate}</h5>
        <div className="daily-plan-list">
          <div className="plan-item-list">
            {planList.length > 0 ? (
              planList.map((plan, index) => {
                return (
                  <PlanItem
                    key={"plan-item-" + index}
                    plan={plan}
                    timeOptionsArr={timeOptionsArr}
                    backServer={backServer}
                    setEdited={setEdited}
                    editPlanList={editPlanList}
                    setEditPlanList={setEditPlanList}
                  />
                );
              })
            ) : (
              <h5>아직 일정이 없어요.</h5>
            )}
          </div>
          <div className="edit-button-box">
            <button
              className={"edit-button" + (edited ? "-active" : "")}
              onClick={editPlan}
            >
              일정 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForeignPlanList;
