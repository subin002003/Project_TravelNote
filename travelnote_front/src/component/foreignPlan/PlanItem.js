import axios from "axios";
import { createElement, useEffect, useState } from "react";

const PlanItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const { itineraryNo, selectedDay, planList, setPlanList } = props;
  const [timeOptionsArr, setTimeOptionsArr] = useState([]);

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

  const changeMemo = (e) => {
    console.log(e.target.value);
  };

  return (
    <div className="plan-item-list">
      {planList.length > 0 ? (
        planList.map((plan, index) => {
          return (
            <div className="plan-item" key={"plan-item-" + index}>
              <div className="plan-seq-info-box">
                <div className="plan-seq-icon">{plan.planSeq}</div>
                <div className="plan-time">
                  <select
                    selected={plan.planTime ? plan.planTime : ""}
                    id="planTimeSelector"
                  >
                    <option>시간 미정</option>
                    {timeOptionsArr.map((time, index) => {
                      return (
                        <option key={"time-option-" + index} value={time}>
                          {time}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="plan-info-box">
                <div className="plan-name">{plan.planName}</div>
                <div className="plan-memo">
                  <input value={plan.planMemo}></input>
                </div>
              </div>
              <div className="plan-image-box">
                <img
                  src={
                    plan.planImg
                      ? `${backServer}/foreign/${plan.planImg}`
                      : "/image/default_img.png"
                  }
                ></img>
              </div>
            </div>
          );
        })
      ) : (
        <h5>아직 일정이 없어요.</h5>
      )}
    </div>
  );
};

export default PlanItem;
