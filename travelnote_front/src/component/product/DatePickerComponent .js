import React, { useState } from "react";
import Swal from "sweetalert2";

const DateRangePickerComponent = ({ onDateRangeChange }) => {
  const [dateRangeText, setDateRangeText] = useState("날짜 범위 선택");

  const showDateRangePicker = async () => {
    const { value: dates } = await Swal.fire({
      title: "Select Date Range",
      html: `
        <input type="date" id="start-date" class="swal2-input" />
        <input type="date" id="end-date" class="swal2-input" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      preConfirm: () => {
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        if (!startDate || !endDate) {
          Swal.showValidationMessage("모든 날짜를 선택해주세요.");
        } else if (new Date(startDate) > new Date(endDate)) {
          Swal.showValidationMessage(
            "시작 날짜는 종료 날짜보다 이전이어야 합니다."
          );
        }
        return { startDate, endDate };
      },
    });

    if (dates) {
      // 선택된 날짜 범위를 버튼 텍스트로 업데이트
      const start = new Date(dates.startDate);
      const end = new Date(dates.endDate);

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const startFormatted = start.toLocaleDateString("ko-KR", options);
      const endFormatted = end.toLocaleDateString("ko-KR", options);

      const dateRangeText = `${startFormatted} ~ ${endFormatted}`;
      setDateRangeText(dateRangeText);

      // 부모 컴포넌트에 날짜 범위 전달
      onDateRangeChange(dates.startDate, dates.endDate);
    }
  };

  return (
    <div>
      {/* <h2>날짜 범위 선택</h2> */}
      <button className="date-picker" onClick={showDateRangePicker}>
        {dateRangeText}
      </button>
    </div>
  );
};

export default DateRangePickerComponent;
