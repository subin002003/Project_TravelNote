const ForeignPlanDaysButton = (props) => {
  const planDays = props.planDays;
  const selectedDay = props.selectedDay;
  const setSelectedDay = props.setSelectedDay;
  const totalPlanDates = props.totalPlanDates;

  planDays.splice(0, planDays.length);

  if (selectedDay === 1) {
    // selectedDay가 1일 때
    console.log(1);

    for (
      let i = 0;
      i < (totalPlanDates.length > 3 ? 3 : totalPlanDates.length);
      i++
    ) {
      planDays.push(
        <li
          key={"date-button-" + (i + 1)}
          onClick={(e) => {
            setSelectedDay(Number(e.target.children[1].innerText));
          }}
          className={"date-button" + (i === 0 ? " selected-day" : "")}
        >
          <span>Day</span>
          <span>{i + 1}</span>
        </li>
      );
    }
    console.log(planDays);
  } else if (selectedDay === totalPlanDates.length) {
    // selectedDay가 마지막 날일 때
    console.log(2);

    for (let i = 2; i >= 0; i--) {
      planDays.push(
        <li
          key={"date-button-" + (selectedDay - i)}
          onClick={(e) => {
            setSelectedDay(Number(e.target.children[1].innerText));
          }}
          className={"date-button" + (i === 0 ? " selected-day" : "")}
        >
          <span>Day</span>
          <span>{selectedDay - i}</span>
        </li>
      );
    }
  } else {
    // selectedDay가 2 이상이고 마지막 날이 아닐 때
    console.log(3);
    for (let i = 0; i < 3; i++) {}
  }

  return <ul className="plan-dates-list">{planDays}</ul>;
};

export default ForeignPlanDaysButton;
