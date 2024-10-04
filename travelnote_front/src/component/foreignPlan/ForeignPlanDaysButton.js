const ForeignPlanDaysButton = (props) => {
  const planDays = props.planDays;
  const selectedDay = props.selectedDay;
  const setSelectedDay = props.setSelectedDay;
  const totalPlanDates = props.totalPlanDates;
  const moveToClickedDay = (e) => {
    setSelectedDay(Number(e.target.id));
  };

  planDays.splice(0, planDays.length);

  planDays.push(
    <li key="first-day-button" onClick={moveToClickedDay} id={1}>
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
    // selectedDay가 1일 때
    for (
      let i = 0;
      i < (totalPlanDates.length > 3 ? 3 : totalPlanDates.length);
      i++
    ) {
      planDays.push(
        <li
          key={"date-button-" + (i + 1)}
          onClick={moveToClickedDay}
          className={"date-button-" + (i === 0 ? " selected-day" : "")}
          id={i + 1}
        >
          <span id={i + 1}>Day</span>
          <span id={i + 1}>{i + 1}</span>
        </li>
      );
    }
  } else if (selectedDay === totalPlanDates.length) {
    // selectedDay가 마지막 날일 때 -> totalPlanDates.length에 따라 달라짐
    if (totalPlanDates.length >= 3) {
      for (let i = 2; i >= 0; i--) {
        planDays.push(
          <li
            key={"date-button-" + (selectedDay - i)}
            onClick={moveToClickedDay}
            className={"date-button-" + (i === 0 ? " selected-day" : "")}
            id={selectedDay - i}
          >
            <span id={selectedDay - i}>Day</span>
            <span id={selectedDay - i}>{selectedDay - i}</span>
          </li>
        );
      }
    } else if (totalPlanDates.length === 2) {
      for (let i = 0; i < totalPlanDates.length; i++) {
        planDays.push(
          <li
            key={"date-button-" + (i + 1)}
            onClick={moveToClickedDay}
            className={
              "date-button-" + (i + 1 === selectedDay ? " selected-day" : "")
            }
            id={i + 1}
          >
            <span id={i + 1}>Day</span>
            <span id={i + 1}>{i + 1}</span>
          </li>
        );
      }
    }
  } else {
    // selectedDay가 2 이상이고 마지막 날이 아닐 때
    for (let i = 0; i < 3; i++) {
      planDays.push(
        <li
          key={"date-button-" + (selectedDay - 1 + i)}
          onClick={moveToClickedDay}
          className={"date-button-" + (i === 1 ? " selected-day" : "")}
          id={selectedDay - 1 + i}
        >
          <span id={selectedDay - 1 + i}>Day</span>
          <span id={selectedDay - 1 + i}>{selectedDay - 1 + i}</span>
        </li>
      );
    }
  }

  planDays.push(
    <li
      key="last-day-button"
      onClick={moveToClickedDay}
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

  return <ul className="plan-dates-list">{planDays}</ul>;
};

export default ForeignPlanDaysButton;
