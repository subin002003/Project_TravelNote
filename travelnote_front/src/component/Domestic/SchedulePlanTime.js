import { useEffect, useState } from "react";

const SchedulePlanTime = (props) => {
  const {
    plan,
    timeOptionsArr,
    backServer,
    setEdited,
    editPlanList,
    setEditPlanList,
    planPageOption, // planPageOption이 1이면 조회, 2면 수정
    setPlanPageOption,
  } = props;

  const [saveUpdatedPlan, setSaveUpdatedPlan] = useState({}); // 수정할 정보 저장

  useEffect(() => {
    setSaveUpdatedPlan({
      planNo: plan.planNo,
      planMemo: plan.planMemo,
      planTime: plan.planTime,
    });
  }, [plan]);

  const saveTime = (e) => {
    setSaveUpdatedPlan({ ...saveUpdatedPlan, [e.target.id]: e.target.value });
    setEdited(true);

    const newPlanList = editPlanList.filter((item) => {
      return item.planNo !== saveUpdatedPlan.planNo;
    });
    newPlanList.push({ ...saveUpdatedPlan, [e.target.id]: e.target.value });
    setEditPlanList([...newPlanList]);
  };

  return (
    <div className="plan-wrap">
      <div className="plan-header">
        <div className="plan-content">{plan.planSeq}</div>
        <div className="plan-time-selector">
          <select
            id="planTime"
            onClick={saveTime}
            key={saveUpdatedPlan.planTime}
            defaultValue={saveUpdatedPlan.planTime}
            disabled={planPageOption === 1}
          >
            <option value="">시간 미정</option>
            {timeOptionsArr.map((time, index) => (
              <option key={"time-option-" + index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="plan-details">
        <div className="plan-name-list">{plan.planName}</div>
        <div className="plan-notes">
          <input
            id="planMemo"
            value={saveUpdatedPlan.planMemo || ""}
            placeholder={planPageOption === 1 ? "" : "메모를 입력해 주세요."}
            onChange={saveTime}
            disabled={planPageOption === 1}
          />
        </div>
      </div>
      <div className="plan-image">
        <img
          src={
            plan.planImg
              ? `${backServer}/domestic/${plan.planImg}`
              : "/images/default_img.png"
          }
          alt="Plan"
        />
      </div>
    </div>
  );
};
export default SchedulePlanTime;
