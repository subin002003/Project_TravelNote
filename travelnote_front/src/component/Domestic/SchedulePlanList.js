import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import SchedulePlanButton from "./SchedulePlanButton";
import SchedulePlanTime from "./SchedulePlanTime";
import Swal from "sweetalert2";

const SchedulePlanList = (props) => {
  const {
    itinerary,
    planDays,
    selectedDay,
    setSelectedDay,
    totalPlanDates,
    planPageOption,
    setPlanPageOption,
    selectedPlans,
    setSelectedPlans, // selectedPlans의 setter를 props에서 받아옵니다.
  } = props;

  const backServer = process.env.REACT_APP_BACK_SERVER; // 서버 URL
  const navigate = useNavigate(); // 페이지 네비게이션을 위한 훅
  const params = useParams(); // URL 파라미터를 가져오는 훅
  const itineraryNo = params.itineraryNo; // 일정 번호
  const selectedDate = totalPlanDates[selectedDay - 1]; // 선택된 날짜
  const [planList, setPlanList] = useState([]); // 조회 중인 일정 목록 배열
  const [timeOptionsArr, setTimeOptionsArr] = useState([]); // 시간 선택 옵션 배열
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editList, setEditList] = useState([]); // 수정할 일정 목록
  const [edited, setEdited] = useState(false); // 수정 여부 상태
  const [editPlanList, setEditPlanList] = useState([]); // 수정할 계획 목록

  // 상세 일정 조회
  useEffect(() => {
    if (itinerary.itineraryNo > 0) {
      setEditList([]); // 수정 목록 초기화
      axios
        .get(`${backServer}/domestic/plan`, {
          params: {
            itineraryNo: itinerary.itineraryNo,
            planDay: selectedDay,
          },
        })
        .then((res) => {
          console.log(res);
          setPlanList(res.data); // 받아온 데이터를 상태에 저장
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [itinerary, selectedDate]);

  // 시간 배열 생성
  useEffect(() => {
    if (timeOptionsArr.length === 0) {
      const options = [];
      for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        for (let j = 0; j < 60; j += 30) {
          const minute = j < 10 ? `0${j}` : `${j}`;
          options.push(`${hour}:${minute}`); // HH:mm 형식으로 시간 추가
        }
      }
      setTimeOptionsArr(options);
    }
  }, []);

  // 수정된 일정 저장
  const saveUpdatedPlans = () => {
    if (isEditing) {
      const updateList = JSON.stringify(editPlanList); // 수정할 목록으로 업데이트
      axios
        .patch(`${backServer}/domestic/updatePlan`, updateList, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data) {
            Swal.fire({
              icon: "success",
              text: "수정이 완료되었습니다.",
            });
            setEditPlanList([]); // 수정 목록 초기화
            setIsEditing(false); // 수정 모드 종료
            setEdited(false); // 수정 여부 상태 초기화
            setPlanPageOption(1); // 기본 조회 모드로 돌아가기
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
    }
  };

  // 조회에서 버튼 클릭 시 수정 모드로 전환
  const toggleEditMode = () => {
    if (isEditing) {
      saveUpdatedPlans(); // 수정 완료 시 저장
    } else {
      setIsEditing(true); // 수정 모드로 전환
      setPlanPageOption(2); // 수정 페이지로 변경
    }
  };

  // 일정 관리 페이지로 이동
  const handleManageClick = () => {
    navigate(`/Domestic/share/${itineraryNo}`);
  };

  // 일정 선택 처리
  const handleSelectPlan = (plan) => {
    if (selectedPlans.includes(plan)) {
      setSelectedPlans(
        selectedPlans.filter((selectedPlan) => selectedPlan !== plan)
      ); // 선택 해제
    } else {
      setSelectedPlans([...selectedPlans, plan]); // 선택 추가
    }
  };

  return (
    <div className="schedule-plan-wrap">
      <div className="schedule-list">
        <h3>{itinerary.itineraryTitle}</h3>
        <h4>
          {itinerary.countryName} {itinerary.regionName}
        </h4>
        <h4>
          {itinerary.itineraryStartDate} ~ {itinerary.itineraryEndDate}
        </h4>
        <h4>선택된 날짜: {selectedDate}</h4>
        <button onClick={handleManageClick} className="share-button">
          여행 관리
        </button>
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
        <div className="schedule-content">
          <div className="schedule-itinerary">
            {planList.length > 0 ? (
              planList.map((plan, index) => (
                <SchedulePlanTime
                  key={"plan-item-" + index}
                  plan={plan}
                  timeOptionsArr={timeOptionsArr}
                  backServer={backServer}
                  setIsEditing={setIsEditing}
                  editPlanList={editPlanList}
                  setEditPlanList={setEditPlanList}
                  planPageOption={planPageOption}
                  setPlanPageOption={setPlanPageOption}
                  setEdited={setEdited}
                  handleSelectPlan={handleSelectPlan}
                  isSelected={selectedPlans.includes(plan)}
                  setPlanList={setPlanList}
                />
              ))
            ) : (
              <h3>일정이 없습니다.</h3>
            )}
          </div>
        </div>
      </div>
      <div className="button-container">
        <button
          className={"Editing-btn" + (isEditing ? "-active" : "")}
          onClick={toggleEditMode}
        >
          {isEditing ? "수정 완료" : "일정 수정하기"}
        </button>
      </div>
      <div className="selected-plans">
        {selectedPlans.length > 0 ? (
          <ul>
            {selectedPlans.map((plan, index) => (
              <li key={"selected-plan-" + index}>{plan.title}</li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default SchedulePlanList;
