import { Link, useNavigate } from "react-router-dom";
import ForeignPlanDaysButton from "./ForeignPlanDaysButton";
import { useEffect, useState } from "react";
import axios from "axios";
import PlanItem from "./PlanItem";
import Swal from "sweetalert2";

const ForeignPlanList = (props) => {
  const {
    itinerary,
    planDays,
    selectedDay,
    setSelectedDay,
    totalPlanDates,
    planPageOption, // planPageOption이 1이면 조회, 2면 수정
    setPlanPageOption,
    planList,
    setPlanList,
    isPlanAdded,
    setIsPlanAdded,
    timeOptionsArr,
  } = props;

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const selectedDate = totalPlanDates[selectedDay - 1];
  const [edited, setEdited] = useState(false);
  const [editPlanList, setEditPlanList] = useState([]); // 수정할 일정 목록

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // 로그인한 아이디 조회 중인 여정 번호의 주인이 맞는지 확인해야 함
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
          setPlanList(res.data);
          setIsPlanAdded(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [itinerary, selectedDate, isPlanAdded]);

  // 일정 수정 버튼 클릭 시 일정 수정 적용
  const editPlan = () => {
    if (edited) {
      const planListStr = JSON.stringify(editPlanList);
      axios
        .patch(`${backServer}/foreign/editPlanInfo`, planListStr, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // 수정 성공 시 true로 받아옴
          if (res.data) {
            Swal.fire({
              icon: "success",
              text: "메모와 시간이 저장되었습니다.",
            });
            setEditPlanList([]);
            setEdited(false);
          } else {
            Swal.fire({
              icon: "error",
              text: "처리 중 오류가 발생했습니다.",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPlanPageOption(1);
    }
  };

  // 조회에서 버튼 클릭 시 수정으로 전환
  const moveToEdit = () => {
    setPlanPageOption(2);
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
        <Link
          to={"/foreign/editItinerary/" + itinerary.itineraryNo}
          className="edit-itinerary-button"
        >
          이 여행 정보 수정
        </Link>
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
                    setEdited={setEdited}
                    editPlanList={editPlanList}
                    setEditPlanList={setEditPlanList}
                    planPageOption={planPageOption}
                  />
                );
              })
            ) : (
              <h5>아직 일정이 없어요.</h5>
            )}
          </div>
          <div className="edit-button-box">
            {planPageOption == 1 ? (
              <button className={"edit-button-active"} onClick={moveToEdit}>
                일정 수정하기
              </button>
            ) : (
              <button
                className={"edit-button" + (edited ? "-active" : "")}
                onClick={editPlan}
              >
                {edited ? "메모/시간 저장" : "수정 끝내기"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForeignPlanList;
