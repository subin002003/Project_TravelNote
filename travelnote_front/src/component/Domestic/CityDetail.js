import { useParams, useNavigate } from "react-router-dom";
import "./CityDetail.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loginEmailState } from "../utils/RecoilData";

const CityDetail = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const { cityName, regionNo } = useParams();
  const navigate = useNavigate();
  const [loginEmail] = useRecoilState(loginEmailState);

  const [tripTitle, setTripTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cityInfo, setCityInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`${backServer}/regions/view/${regionNo}`)
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        text: "날짜를 입력해 주세요.",
      });
      return;
    }

    const form = new FormData();
    form.append("userEmail", loginEmail);
    form.append("regionNo", regionNo);
    form.append("itineraryStartDate", startDate);
    form.append("itineraryEndDate", endDate);
    form.append(
      "itineraryTitle",
      tripTitle.trim() || `${cityName}으로 떠나는 여행`
    );

    axios
      .post(`${backServer}/regions/Schedule`, form)
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: "여행 일정이 성공적으로 저장되었습니다.",
        });
        navigate(`/schedule/${res.data}`); // 수정된 부분: itinearyNo 직접 사용
      })
      .catch((err) => {
        console.error("Error saving itinerary:", err);
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
              src={`/images/${cityInfo.regionName}.jpg`}
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
                  onChange={(e) => setTripTitle(e.target.value)}
                />
              </label>
              <div className="date-inputs">
                <label>
                  여행 시작 날짜:
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label>
                  여행 종료 날짜:
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
              </div>
              <button className="trip-btn" type="submit">
                여행 일정 만들기
              </button>
            </form>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
