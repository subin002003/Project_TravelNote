import React, { useEffect, useState } from "react";

const SchedulePlanButton = (props) => {
  const { totalPlanDates, selectedDay, setSelectedDay } = props;

  const [planDays, setPlanDays] = useState([]);

  useEffect(() => {
    const newPlanDays = [];

    // 첫 번째 버튼 추가
    newPlanDays.push(
      <li
        key="first-button"
        onClick={() => setSelectedDay((prev) => Math.max(prev - 1, 1))}
        id={1}
      >
        <span
          className={
            "material-icons day-item" + (selectedDay === 1 ? "" : " active")
          }
          id={1}
        >
          arrow_left
        </span>
      </li>
    );

    if (selectedDay === 1) {
      for (let i = 0; i < Math.min(totalPlanDates.length, 3); i++) {
        newPlanDays.push(
          <li
            key={"plan-button" + (i + 1)}
            onClick={() => setSelectedDay(i + 1)}
            className={"plan-button" + (i === 0 ? " selected-day" : "")}
            id={i + 1}
          >
            <span id={i + 1}>Day</span>
            <span id={i + 1}>{i + 1}</span>
          </li>
        );
      }
    } else if (selectedDay === totalPlanDates.length) {
      for (let i = 2; i >= 0; i--) {
        newPlanDays.push(
          <li
            key={"plan-button" + (selectedDay - i)}
            onClick={() => setSelectedDay(selectedDay - i)}
            className={"plan-button" + (i === 0 ? " selected-day" : "")}
            id={selectedDay - i}
          >
            <span id={selectedDay - i}>Day</span>
            <span id={selectedDay - i}>{selectedDay - i}</span>
          </li>
        );
      }
    } else {
      for (let i = 0; i < 3; i++) {
        newPlanDays.push(
          <li
            key={"plan-button" + (selectedDay - 1 + i)}
            onClick={() => setSelectedDay(selectedDay - 1 + i)}
            className={"plan-button" + (i === 1 ? " selected-day" : "")}
            id={selectedDay - 1 + i}
          >
            <span id={selectedDay - 1 + i}>Day</span>
            <span id={selectedDay - 1 + i}>{selectedDay - 1 + i}</span>
          </li>
        );
      }
    }

    // 마지막 버튼 추가
    newPlanDays.push(
      <li
        key="last-button"
        onClick={() =>
          setSelectedDay((prev) => Math.min(prev + 1, totalPlanDates.length))
        }
        id={totalPlanDates.length}
      >
        <span
          className={
            "material-icons day-item" +
            (selectedDay === totalPlanDates.length ? "" : " active")
          }
          id={totalPlanDates.length}
        >
          arrow_right
        </span>
      </li>
    );

    setPlanDays(newPlanDays);
  }, [selectedDay, totalPlanDates]);

  return <ul className="plan-list">{planDays}</ul>;
};

export default SchedulePlanButton;
