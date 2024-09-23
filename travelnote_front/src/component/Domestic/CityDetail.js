import { useParams, useNavigate } from "react-router-dom";
import "./CityDetail.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import {
  loginEmailState, // 로그인 이메일 상태
} from "../utils/RecoilData"; // Recoil 상태 데이터 불러오기

const CityDetail = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER; // 백엔드 서버 주소 환경 변수
  const { cityName, regionNo } = useParams(); // URL 파라미터로부터 도시 이름과 지역 번호 가져오기
  const navigate = useNavigate(); // 페이지 네비게이션을 위한 hook
  const [loginEmail] = useRecoilState(loginEmailState); // Recoil을 통해 로그인 이메일 상태 가져오기

  // 여행 제목과 날짜 상태 관리
  const [tripTitle, setTripTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 도시 정보 상태
  const [cityInfo, setCityInfo] = useState(null);

  // 도시 정보 가져오기
  useEffect(() => {
    axios
      .get(`${backServer}/regions/${regionNo}`) // 백엔드에서 도시 정보 가져오기
      .then((res) => {
        setCityInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching city info:", err);
        Swal.fire({
          icon: "error",
          text: "도시 정보를 가져오는 데 실패했습니다.",
        });
      });
  }, [backServer, regionNo]);

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 막기

    // 날짜가 입력되지 않았을 경우 경고창 표시
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        text: "날짜를 입력해 주세요.",
      });
      return;
    }

    // FormData 생성 및 데이터 추가
    const form = new FormData();
    form.append("userEmail", loginEmail); // 로그인 이메일 추가
    form.append("regionNo", regionNo); // 지역 번호 추가
    form.append("itineraryStartDate", startDate); // 시작 날짜 추가
    form.append("itineraryEndDate", endDate); // 종료 날짜 추가
    form.append("itineraryTitle", tripTitle || `${cityName}으로 떠나는 여행`); // 제목이 비어있으면 기본값 사용

    // Axios를 사용해 POST 요청 전송
    axios
      .post(`${backServer}/regions/Schedule`, form) // 백엔드로 데이터 전송
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: "여행 일정이 성공적으로 저장되었습니다.",
        });
        // 저장된 일정 번호로 페이지 이동
        navigate(`/schedule/${res.data.itineraryNo}`);
      })
      .catch((err) => {
        console.error("Error saving itinerary:", err); // 에러 발생 시 콘솔에 출력
        Swal.fire({
          icon: "error",
          text: "여행 일정 저장에 실패했습니다.",
        });
      });
  };

  return (
    <div className="city-detail">
      <div className="detail-content">
        {cityInfo ? (
          <>
            <h1>{cityInfo.regionName}</h1>
            <img
              src={`/images/${cityInfo.regionName}.jpg`} // 해당 도시 이미지를 public 폴더에서 가져오기
              alt={cityInfo.regionName}
              className="city-detail-image"
            />
            <form className="trip-form" onSubmit={handleSubmit}>
              <label>
                여행 제목 입력:
                <input
                  type="text"
                  placeholder="여행 제목을 입력해주세요"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)} // 입력값 상태 변경
                />
              </label>
              <div className="date-inputs">
                <label>
                  여행 시작 날짜:
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} // 시작 날짜 상태 변경
                  />
                </label>
                <label>
                  여행 종료 날짜:
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)} // 종료 날짜 상태 변경
                  />
                </label>
              </div>
              <button className="trip-btn" type="submit">
                여행 일정 만들기
              </button>
            </form>
          </>
        ) : (
          <p>Loading...</p> // 도시 정보 로딩 중 표시
        )}
      </div>
    </div>
  );
};

export default CityDetail;
