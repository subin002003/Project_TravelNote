import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const DomesticPlanShare = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
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
  const navigate = useNavigate();

  useEffect(() => {
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

  // 여행 계획 삭제하기 버튼 클릭 시 실행되는 함수
  const handleDelete = () => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제 후에는 복구할 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${backServer}/domestic/planDelete/${itineraryNo}`)
          .then((res) => {
            Swal.fire({
              icon: "success",
              text: "여행 계획이 삭제되었습니다.",
            });
            navigate("/");
          })
          .catch((err) => {
            console.error("Error deleting trip:", err);
            Swal.fire({
              icon: "error",
              text: "여행 계획 삭제에 실패했습니다.",
            });
          });
      }
    });
  };

  // 동행자 추가 버튼 클릭 시 실행되는 함수
  const handleAddCompanion = () => {
    axios
      .post(`${backServer}/domestic/invite`, {
        itineraryNo,
        userEmail: email,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: `${email}을(를) 초대했습니다.`,
        });
        setEmail("");
        setShowInvite(false);
      })
      .catch((err) => {
        console.error("Error inviting companion:", err);
        const errorMessage =
          err.response?.data?.message || "동행자 초대에 실패했습니다.";
        if (errorMessage.includes("이미 추가된")) {
          Swal.fire({
            icon: "warning",
            text: "이미 추가된 동행자입니다.",
          });
        } else {
          Swal.fire({
            icon: "error",
            text: errorMessage,
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
            onChange={(e) => setTripTitle(e.target.value)}
          />
        </label>
        <div className="date-inputs">
          <label>
            여행 시작 날짜:
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            여행 종료 날짜:
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="button-content">
        <button className="Plan-btn" onClick={handleUpdate}>
          여행 계획 수정하기
        </button>
        <button className="Plan-del-btn" onClick={handleDelete}>
          여행 계획 삭제하기
        </button>
      </div>
    </div>
  );
};

export default DomesticPlanShare;
