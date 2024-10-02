import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios"; // Axios import

const SchedulePlanTime = (props) => {
  const {
    plan,
    timeOptionsArr,
    setEdited,
    editPlanList,
    setEditPlanList,
    planPageOption,
  } = props;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [saveUpdatedPlan, setSaveUpdatedPlan] = useState({
    planNo: plan.planNo,
    planMemo: plan.planMemo,
    planTime: plan.planTime,
  }); // 수정할 정보 저장

  useEffect(() => {
    setSaveUpdatedPlan({
      planNo: plan.planNo,
      planMemo: plan.planMemo,
      planTime: plan.planTime,
    });
  }, [plan]);

  const saveTime = (e) => {
    const updatedValue = e.target.value;
    const fieldName = e.target.id;

    setSaveUpdatedPlan((prevState) => ({
      ...prevState,
      [fieldName]: updatedValue,
    }));

    setEdited(true);

    // 수정된 계획 리스트 업데이트
    setSaveUpdatedPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan, [fieldName]: updatedValue };

      if (editPlanList && Array.isArray(editPlanList)) {
        const newPlanList = editPlanList.filter(
          (item) => item.planNo !== updatedPlan.planNo
        );
        newPlanList.push(updatedPlan);
        setEditPlanList(newPlanList);
      }

      return updatedPlan;
    });
  };

  const deletePlan = () => {
    Swal.fire({
      title: "일정을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${backServer}/domestic/deletePlans/${saveUpdatedPlan.planNo}`
          )
          .then((response) => {
            if (response.status === 200) {
              if (editPlanList && Array.isArray(editPlanList)) {
                const newPlanList = editPlanList.filter(
                  (item) => item.planNo !== saveUpdatedPlan.planNo
                );
                console.log("삭제 성공:", newPlanList);
                setEditPlanList(newPlanList);
                Swal.fire(
                  "삭제되었습니다!",
                  "일정이 삭제되었습니다.",
                  "success"
                );
              }
            }
          })
          .catch((error) => {
            console.error("삭제 실패:", error);
            Swal.fire(
              "삭제 실패",
              "일정 삭제 중 오류가 발생했습니다.",
              "error"
            );
          });
      }
    });
  };

  return (
    <div className="plan-wrap">
      <div className="plan-header">
        <div className="plan-content">{plan.planSeq}</div>
        <button className="delete-plan-btn" onClick={deletePlan}>
          X
        </button>
      </div>
      <div className="plan-details">
        <div className="plan-name-list">{plan.planName}</div>
        <div className="plan-time-selector">
          <select
            id="planTime"
            onChange={saveTime}
            value={saveUpdatedPlan.planTime || ""}
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
    </div>
  );
};

export default SchedulePlanTime;
