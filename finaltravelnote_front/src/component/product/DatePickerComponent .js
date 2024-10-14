import React, { useState } from "react";
import Swal from "sweetalert2";

const DateRangePickerComponent = ({ onDateRangeChange }) => {
  const [dateRangeText, setDateRangeText] = useState("여행 날짜 선택");

  const showDateRangePicker = async () => {
    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기

    const { value: dates } = await Swal.fire({
      title: "Select Date Range",
      html: `
        <input type="date" id="start-date" class="swal2-input" min="${today}" placeholder="시작 날짜 선택" />
        <input type="date" id="end-date" class="swal2-input" placeholder="종료 날짜 선택" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      preConfirm: () => {
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        if (!startDate) {
          Swal.showValidationMessage("시작 날짜를 먼저 선택해주세요.");
          return false;
        } else if (!endDate) {
          Swal.showValidationMessage("종료 날짜를 선택해주세요.");
          return false;
        } else if (new Date(startDate) > new Date(endDate)) {
          Swal.showValidationMessage("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
          return false;
        }
        return { startDate, endDate };
      },
      didOpen: () => {
        const startDateInput = document.getElementById("start-date");
        const endDateInput = document.getElementById("end-date");

        startDateInput.addEventListener("change", (e) => {
          const startDate = e.target.value;
          endDateInput.setAttribute("min", startDate); // 시작 날짜를 기준으로 종료 날짜 설정
        });
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
      <button className="date-picker" onClick={showDateRangePicker}>
        {dateRangeText}
      </button>
    </div>
  );
};

export default DateRangePickerComponent;
