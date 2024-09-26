import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SchedulePlanButton from "./SchedulePlanButton";
import SchedulePlanTime from "./SchedulePlanTime";

const SchedulePlanList = (props) => {
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
  const [editList, seteditList] = useState([]); // 수정할 일정 목록

  //상세 일정 조회
  useEffect(() => {
    if (itinerary.itineraryNo > 0) {
      seteditList([]);
      axios
        .get(`${backServer}/domestic/Plan`, {
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
  //시간 배열
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

  const ScheduleEdit = () => {
    if (edited) {
      const form = new FormData();
      form.append("editList", editList);
      axios
        .post(`${backServer}/domestic/edit`, form)
        .then(() => {})
        .catch(() => {});
    }
  };

  return (
    <div className="schedule-plan-wrap">
      <div className="schedule-list">
        <h4>{itinerary.itineraryTitle}</h4>
        <h5>
          {itinerary.countryName} {itinerary.regionName}
        </h5>
        <h5>
          {itinerary.itineraryStartDate} {itinerary.itineraryEndDate}
        </h5>
      </div>
      <div className="schedule-box">
        {totalPlanDates.length > 0 ? (
          <SchedulePlanButton
            planDays={planDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            totalPlanDates={totalPlanDates}
          />
        ) : (
          ""
        )}
      </div>
      <div className="schedule-plan-list">
        <h5>{selectedDate}</h5>
        <div className="schedule-content">
          <div className="schedule-itinerary">
            {planList.length > 0 ? (
              planList.map((plan, index) => {
                return (
                  <SchedulePlanTime
                    key={"plan-item-" + index}
                    plan={plan}
                    timeOptionsArr={timeOptionsArr}
                    backServer={backServer}
                    setEdited={setEdited}
                    editList={editList}
                    seteditList={seteditList}
                  />
                );
              })
            ) : (
              <h3></h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePlanList;
