import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const DomesticPlanShare = () => {
  const params = useParams();
  const itineraryNo = params.itineraryNo; // URL에서 itineraryNo 가져오기
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [tripTitle, setTripTitle] = useState(""); // 여행 제목 상태 추가
  const [startDate, setStartDate] = useState(""); // 시작 날짜 상태 추가
  const [endDate, setEndDate] = useState(""); // 종료 날짜 상태 추가
  const [email, setEmail] = useState(""); // 동행자 이메일 상태 추가
  const [showInvite, setShowInvite] = useState(false); // 초대 폼 표시 상태
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const backServer = process.env.REACT_APP_BACK_SERVER;

    // 여행 계획 정보를 가져오는 API 호출
    axios
      .get(`${backServer}/domestic/Schedule/${itineraryNo}`)
      .then((res) => {
        console.log("Trip details fetched:", res.data); // 성공 로그
        setTripDetails(res.data);
        setTripTitle(res.data.itineraryTitle); // 제목 설정
        setStartDate(res.data.itineraryStartDate); // 시작 날짜 설정
        setEndDate(res.data.itineraryEndDate); // 종료 날짜 설정
        setLoading(false); // 로딩 완료
      })
      .catch((err) => {
        console.error("Error fetching trip details:", err);
        Swal.fire({
          icon: "error",
          text: "여행 계획 정보를 가져오는 데 실패했습니다.",
        });
        setLoading(false); // 로딩 완료
      });
  }, [itineraryNo]);

  // 여행 계획 수정하기 버튼 클릭 시 실행되는 함수
  const handleUpdate = () => {
    const backServer = process.env.REACT_APP_BACK_SERVER;

    // 수정된 내용 서버에 제출
    axios
      .patch(`${backServer}/domestic/itinerary/${itineraryNo}`, {
        itineraryTitle: tripTitle,
        itineraryStartDate: startDate,
        itineraryEndDate: endDate,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: res.data,
        });
      })
      .catch((err) => {
        console.error("Error updating trip details:", err);
        Swal.fire({
          icon: "error",
          text: "여행 계획 수정에 실패했습니다.",
        });
      });
  };

  // 동행자 추가 버튼 클릭 시 실행되는 함수
  const handleAddCompanion = () => {
    const backServer = process.env.REACT_APP_BACK_SERVER;
    console.log("Inviting companion with:", { itineraryNo, email });

    // 이메일 서버에 전송
    axios
      .post(`${backServer}/domestic/invite`, {
        itineraryNo,
        userEmail: email, // 확인: API가 이 이름을 기대하는지
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: `${email}을(를) 초대했습니다.`,
        });
        setEmail(""); // 입력 필드 초기화
        setShowInvite(false); // 초대 폼 숨기기
      })
      .catch((err) => {
        console.error("Error inviting companion:", err);
        const errorMessage =
          err.response?.data?.message || "동행자 초대에 실패했습니다.";
        // 중복 이메일 확인을 위한 메시지 추가
        if (errorMessage.includes("이미 추가된")) {
          Swal.fire({
            icon: "warning",
            text: "이미 추가된 동행자입니다.", // 중복 이메일 메시지
          });
        } else {
          Swal.fire({
            icon: "error",
            text: errorMessage, // 서버에서 제공한 에러 메시지 사용
          });
        }
      });
  };

  if (loading) {
    return <p>여행 계획 정보를 로드 중입니다...</p>;
  }

  if (!tripDetails) {
    return <p>여행 계획 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="trip-share-container">
      <div className="invite-container">
        <button
          className="companion-btn"
          onClick={() => setShowInvite(!showInvite)}
        >
          {showInvite ? "취소" : "동행자 추가"}
        </button>
        {showInvite && (
          <>
            <input
              type="email"
              placeholder="동행자 이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 이메일 변경 시 상태 업데이트
              className="email-input"
            />
            <button onClick={handleAddCompanion} className="add-companion-btn">
              초대하기
            </button>
          </>
        )}
      </div>
      <div className="trip-details">
        <label>
          여행 제목 입력:
          <input
            type="text"
            placeholder="여행 제목을 입력해주세요"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)} // 제목 변경 시 상태 업데이트
          />
        </label>
        <div className="date-inputs">
          <label>
            여행 시작 날짜:
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)} // 시작 날짜 변경 시 상태 업데이트
            />
          </label>
          <label>
            여행 종료 날짜:
            <input
              type="date"
              value={endDate}
              min={today}
              onChange={(e) => setEndDate(e.target.value)} // 종료 날짜 변경 시 상태 업데이트
            />
          </label>
        </div>
      </div>
      {/* 수정된 내용을 제출할 수 있는 버튼 추가 */}
      <button className="Plan-btn" onClick={handleUpdate}>
        여행 계획 수정하기
      </button>
    </div>
  );
};

export default DomesticPlanShare;
