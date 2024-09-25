import axios from "axios";
import { useEffect } from "react";

const PlanItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const { itineraryNo, selectedDay, planList, setPlanList } = props;
  console.log(1);

  return (
    <div className="plan-item-list">
      {planList.map((plan, index) => {
        return (
          <div className="plan-item" key={"plan-item-" + index}>
            <div className="plan-seq-info-box">
              <div className="plan-seq-icon">{plan.planSeq}</div>
              <div className="plan-time">
                {plan.planTime ? plan.planTime : "시간 미정"}
              </div>
            </div>
            <div className="plan-info-box">
              <div className="plan-name">{plan.planName}</div>
              <div className="plan-memo">
                <input
                  placeholder={
                    plan.planMemo ? plan.planMemo : "메모를 입력해 주세요."
                  }
                ></input>
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
      })}
    </div>
  );
};

export default PlanItem;
