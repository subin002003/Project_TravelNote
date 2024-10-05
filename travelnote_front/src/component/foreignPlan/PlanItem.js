import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PlanItem = (props) => {
  const {
    plan,
    timeOptionsArr,
    setEdited,
    editPlanList,
    setEditPlanList,
    planPageOption, // planPageOption이 1이면 조회, 2면 수정
    setSelectedPosition,
    setPlaceInfo,
    backServer,
    setIsPlanDiffered,
  } = props;
  const [editPlan, setEditPlan] = useState({}); // 수정할 정보 저장planListStr
  const [isSeqHovered, setIsSeqHovered] = useState(false);

  useEffect(() => {
    setEditPlan({
      planNo: plan.planNo,
      planMemo: plan.planMemo,
      planTime: plan.planTime,
    }); // 수정할 정보 저장
  }, [plan]);

  // 이미지 혹은 제목 클릭 시 지도 중심에 위치 표시
  const viewPlace = () => {
    console.log(100);
    setSelectedPosition({
      lat: Number(plan.planLatitude),
      lng: Number(plan.planLongitude),
    });
    // 마커 표시 용
    setPlaceInfo({
      placeName: plan.planName,
      placeLocation: {
        lat: Number(plan.planLatitude),
        lng: Number(plan.planLongitude),
      },
      placeAddress: plan.planAddress,
      placeId: plan.planId,
    });
  };

  // 시간, 메모 변경 적용
  const changeInput = (e) => {
    setEditPlan({ ...editPlan, [e.target.id]: e.target.value });
    setEdited(true);

    // editPlanList 배열에 저장
    const newPlanList = editPlanList.filter((item) => {
      return item.planNo !== editPlan.planNo;
    });
    newPlanList.push({ ...editPlan, [e.target.id]: e.target.value });
    setEditPlanList([...newPlanList]);
  };

  // seq-icon 클릭 시 삭제
  const deletePlan = () => {
    axios
      .delete(`${backServer}/foreign/deletePlan/${plan.planNo}`)
      .then((res) => {
        if (res.data > 0) {
          setIsPlanDiffered(true);
          Swal.fire({
            icon: "success",
            text: "일정에서 삭제되었습니다.",
          });
        }
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  return (
    <div className="plan-item">
      <div className="plan-item-info">
        <div className="plan-info-box">
          <div className="plan-seq-box">
            <div
              className="plan-seq-icon"
              onMouseEnter={() => setIsSeqHovered(true)}
              onMouseLeave={() => setIsSeqHovered(false)}
              onClick={deletePlan}
            >
              {isSeqHovered ? "X" : plan.planSeq}
            </div>
          </div>
          <div className="plan-name-box">
            <div className="plan-place-name" onClick={viewPlace}>
              {plan.planName}
            </div>
          </div>
        </div>
        <div className="plan-sub-box">
          <div className="plan-time">
            <select
              id="planTime"
              onClick={changeInput}
              key={editPlan.planTime}
              defaultValue={editPlan.planTime}
              disabled={planPageOption === 1 ? true : false}
            >
              <option value="">시간 미정</option>
              {timeOptionsArr.map((time, index) => {
                return (
                  <option key={"time-option-" + index} value={time}>
                    {time}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="plan-memo">
            <input
              id="planMemo"
              value={editPlan.planMemo ? editPlan.planMemo : ""}
              placeholder={planPageOption === 1 ? "" : "메모를 입력해 주세요."}
              onChange={changeInput}
              disabled={planPageOption === 1 ? true : false}
            ></input>
          </div>
        </div>
      </div>
      <div className="plan-image-box" onClick={viewPlace}>
        <img
          src={plan.planImage ? plan.planImage : "/image/default_img.png"}
        ></img>
      </div>
    </div>
  );
};

export default PlanItem;
