import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PlanItem = (props) => {
  const {
    plan,
    index,
    timeOptionsArr,
    setEdited,
    editPlanList,
    setEditPlanList,
    planPageOption, // planPageOption이 1이면 조회, 2면 수정
    setSelectedPosition,
    setPlaceInfo,
    backServer,
    setIsPlanDiffered,
    planListLength,
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
    if (planPageOption === 1) return;
    Swal.fire({
      icon: "warning",
      text: "일정에서 삭제할까요?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        // 삭제 버튼을 클릭한 경우 DB 삭제 진행
        axios
          .delete(`${backServer}/foreign/deletePlan/${plan.planNo}`)
          .then((res) => {
            if (res.data == true) {
              setIsPlanDiffered(true);
              Swal.fire({
                icon: "success",
                text: "일정에서 삭제되었습니다.",
              });
            }
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: "서버 오류입니다.",
            });
          });
      }
    });
  };

  // 순서 하나 위로 변경
  const changeSeqUp = () => {
    axios
      .get(`${backServer}/foreign/changeSeqUp/${plan.planNo}`)
      .then((res) => {
        if (res.data === true) {
          setIsPlanDiffered(true);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          text: "서버 오류입니다.",
        });
      });
  };

  // 순서 하나 아래로 변경
  const changeSeqDown = () => {
    axios
      .get(`${backServer}/foreign/changeSeqDown/${plan.planNo}`)
      .then((res) => {
        if (res.data === true) {
          setIsPlanDiffered(true);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          text: "서버 오류입니다.",
        });
      });
  };

  return (
    <div className="plan-item">
      <div className="plan-item-info">
        <div className="plan-info-box">
          <div className="plan-seq-box">
            <div className="plan-seq-change-icons">
              <div
                className={
                  planPageOption === 1 || index === 0
                    ? "inactive-plan-seq-icon"
                    : "plan-seq-up-icon"
                }
                onClick={changeSeqUp}
              >
                <span class="material-icons">arrow_drop_up</span>
              </div>
              <div
                className={
                  planPageOption === 1 || index + 1 === planListLength
                    ? "inactive-plan-seq-icon"
                    : "plan-seq-down-icon"
                }
                onClick={changeSeqDown}
              >
                <span class="material-icons">arrow_drop_down</span>
              </div>
            </div>
            <div
              className={
                planPageOption === 1
                  ? "plan-seq-icon-inactive"
                  : "plan-seq-icon"
              }
              onMouseEnter={() => setIsSeqHovered(true)}
              onMouseLeave={() => setIsSeqHovered(false)}
              onClick={deletePlan}
            >
              {planPageOption === 1
                ? plan.planSeq
                : isSeqHovered
                ? "X"
                : plan.planSeq}
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
